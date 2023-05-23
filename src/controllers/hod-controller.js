const bcrypt = require('bcryptjs');
const Branch = require('../models/branch');
// Models Import ==============================================================
const HOD = require('../models/hod');
const Section = require('../models/section');
const Teacher = require('../models/teacher');
const generateToken = require('../utils/generate-token')
const mongoose = require('mongoose')

// HOD Controllers 
// =============================================================================

// 0. TEST ROUTE
// @desc :: GET REQUEST
const testHOD = (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'HOD APIs working properly'
    })
}



// 1. Create Section
// @desc :: POST REQUEST
const createBranchSection = async (req, res) => {
    try {
        // Section Created By -  Current Signed in Teacher Id (Basically HOD who is creating the section)
        const { year, branchName, sectionName, sectionHead, sectionCreatedBy } = req.body
        if (!year || !branchName || !sectionName || !sectionHead) {
            throw new Error('Some Fields are missing')
        }
        // Find Branch
        const branchData = await Branch.findOne({ name: branchName })
        if (!branchData) {
            throw new Error('Branch does not exist');
        }
        // Verify for section Head
        const teacherData = await Teacher.findOne({ _id: sectionHead })
        if (!teacherData || teacherData.branchName != branchName || teacherData.isSectionHead === true) {
            throw new Error('Invalid Section Head')
        }

        // check for previous existence of section
        const sectionData = await Section.findOne({ sectionYear: year, sectionBranchName: branchName, sectionName: sectionName })
        if (sectionData) {
            throw new Error('Section already exists')
        }
        // Create a section
        const section = await new Section({
            sectionYear: year,
            sectionBranchName: branchName,
            sectionName: sectionName,
            sectionHead: sectionHead,
            sectionCreatedBy: sectionCreatedBy,
        })
        const savedSectionData = await section.save();

        // update teacher -- set isSectionHead as true
        teacherData.sectionHeadRef = savedSectionData._id;
        teacherData.isSectionHead = true;
        const updatedTeacherData = await teacherData.save()

        // Updated Branch 
        // Push saved section id
        if (year === "1") {
            branchData.firstYear.push(savedSectionData._id)
        } else if (year === "2") {
            branchData.secondYear.push(savedSectionData._id)
        }
        else if (year === "3") {
            branchData.thirdYear.push(savedSectionData._id)
        }
        else branchData.fourthYear.push(savedSectionData._id)

        const updatedBranchData = await branchData.save()

        res.status(201).json({
            success: true,
            data: {
                branchData: updatedBranchData,
                sectionData: savedSectionData,
            },
            msg: 'Section Created Successfully'
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
            res.status(400).json({
                success: false,
                error: messages,
            });
        } else {
            console.log(`Error occured ${err}`);
            return res.status(500).json({
                success: false,
                error: `${err}`,
            });
        }
    }
}


// 2. Get List of Teachers from a branch who are not section head
// @desc :: GET REQUEST
const getListOfNotSectionHeadTeachers = async (req, res) => {
    try {
        const { branchName, isSectionHead = false } = req.query;
        if (!branchName) {
            throw new Error('Branch Name missing')
        }
        const teacherData = await Teacher.find({ branchName: branchName, isSectionHead: isSectionHead, isVerified: true, isHod: false })
        res.status(200).json({
            success: true,
            data: teacherData,
            msg: 'Teachers List fetched successfully'
        })
    }
    catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
            res.status(400).json({
                success: false,
                error: messages,
            });
        } else {
            console.log(`Error occured ${err}`);
            return res.status(500).json({
                success: false,
                error: `${err}`,
            });
        }
    }
}


// 3.Get Details of Section
const getListOfSection = async (req, res) => {
    try {
        const { branchName } = req.query;
        console.log(branchName)
        if (!branchName) throw new Error('Branch name not found')
        const sectionList = await Section.find({ sectionBranchName: branchName }).populate({
            path: "sectionStudents.studentId",
        });

        const firstYear = sectionList.filter(item => item.sectionBranchName == branchName && item.sectionYear == "1")
        const secondYear = sectionList.filter(item => item.sectionBranchName == branchName && item.sectionYear == "2")
        const thirdYear = sectionList.filter(item => item.sectionBranchName == branchName && item.sectionYear == "3")
        const fourthYear = sectionList.filter(item => item.sectionBranchName == branchName && item.sectionYear == "4")
        res.status(200).json({
            success: true,
            firstYear: firstYear,
            secondYear,
            thirdYear,
            fourthYear,
            msg: 'Section Data Fetched Successfully'
        })
    }
    catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
            res.status(400).json({
                success: false,
                error: messages,
            });
        } else {
            console.log(`Error occured ${err}`);
            return res.status(500).json({
                success: false,
                error: `${err}`,
            });
        }
    }
}

// 4.Update Section Head
const assignSectionHead = async (req, res) => {
    try {
        const { updatedSectionHeadRef, sectionId } = req.body;
        console.log(req.body)
        if (!updatedSectionHeadRef || !sectionId) {
            throw new Error('Some Details are missing')
        }
        console.log(typeof (sectionId))
        const sectionData = await Section.findById(mongoose.Types.ObjectId(sectionId))
        if (!sectionData) {
            throw new Error('Section Id Invalid')
        }

        // remove previous section head
        const previousSectionHeadId = sectionData?.sectionHead;
        if (previousSectionHeadId) {
            const previousTeacherData = await Teacher.findById(mongoose.Types.ObjectId(previousSectionHeadId))
            previousTeacherData.isSectionHead = false;
            previousTeacherData.sectionHeadRef = null
            // save data
            await previousTeacherData.save();
        }

        // Update Section Data
        sectionData.sectionHead = updatedSectionHeadRef;
        const updatedSectionData = await sectionData.save();
        if (!updatedSectionData) {
            throw new Error('Error while updating section data')
        }

        // add new section head
        const newSectionHeadData = await Teacher.findById(mongoose.Types.ObjectId(updatedSectionHeadRef))
        newSectionHeadData.isSectionHead = true;
        newSectionHeadData.sectionHeadRef = sectionId

        const updatedNewSectionHeadData = await newSectionHeadData.save()

        res.status(200).json({
            success: true,
            data: {
                sectionData: updatedSectionData,
            },
            msg: 'Section Head Assigned Successfully'
        })

    }
    catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
            res.status(400).json({
                success: false,
                error: messages,
            });
        } else {
            console.log(`Error occured ${err}`);
            return res.status(500).json({
                success: false,
                error: `${err}`,
            });
        }
    }
}





module.exports = { testHOD, createBranchSection, getListOfNotSectionHeadTeachers, getListOfSection, assignSectionHead }