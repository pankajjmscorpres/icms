const bcrypt = require('bcryptjs');
const app = require('../routes');
require("dotenv").config({ path: "./config/dev.env" });
// Models Import ==============================================================
const HOD = require('../models/hod');
const Branch = require('../models/branch');
const Teacher = require('../models/teacher');
const res = require('express/lib/response');
const Admin = require('../models/admin');

// Main Controllers 
// =============================================================================

// 0. TEST ROUTE
// @desc :: GET REQUEST
const testAdmin = (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'ADMIN APIs working properly'
    })
}

// 1. ADMIN AUTH
// @desc :: POST REQUEST
const adminAuth = async (req, res) => {
    try {
        const { passCode } = req.body;
        if (!passCode) {
            res.status(401)
            throw new Error('Passcode Cannot be NULL')
        }
        // if passcode matches 
        // generate hash
        // send it to user
        if (passCode === process.env.ADMIN_SECRET) {
            {
                const salt = await bcrypt.genSalt(10)
                const token = await bcrypt.hash(process.env.ADMIN_SECRET, salt)
                res.status(200).json({
                    success: true,
                    data: {
                        isAdmin: true,
                        token: token,
                    },
                    msg: 'Successfully Logged in as Admin'
                })
            }
        }
        else {
            res.status(401).json({
                success: false,
                data: {
                    isAdmin: false,
                },
                msg: 'Incorrect PassCode, Pls Try Again',
            })
        }
    }
    catch (err) {
        res.json({ error: `${err}` })
    }
}

// 2. CREATE BRANCH
// @desc :: POST REQUEST
const createBranch = async (req, res) => {
    try {
        const { name, hodRef = null } = req.body;
        console.log('request', req.body)
        if (!name) {
            res.staus(400).json({
                success: false,
                msg: 'Some Fields are missing',
            })
        }
        if (hodRef) {
            const user = await Teacher.findById({ _id: String(hodRef) })
            if (!user) {
                res.staus(400).json({
                    success: false,
                    msg: 'Invalid Teacher Id',
                })
            }
            const prevBranch = user.branchName;    // to revert changes
            user.isHod = true;
            user.branchName = name;
            const updatedUser = await user.save(); // update user
            if (!updatedUser) {
                res.status(400)
                throw new Error('Some Error Occured')
            }
        }
        const newBranch = new Branch({
            name: name,      // branch name
            hodRef: hodRef   // hod reference id
        })
        const savedBranch = await newBranch.save();
        if (!savedBranch) {
            // revert user
            user.isHod = false;
            user.branchName = prevBranch;
            await user.save();
            res.status(400)
            throw new Error('Some Error Occured')
        }

        res.status(201).json({
            success: true,
            data: {
                isAdmin: true,
                branchData: savedBranch,
            },
            msg: 'Branch Created Successfully',
        })
    }
    catch (err) {
        console.log(err)
        if (err.name === 'MongoServerError' && err.code === 11000) {
            // Duplicate branchname
            return res.status(422).json({ success: false, msg: 'Branch already exist!' });
        }
        else {
            res.status(400).json({ error: `${err}` })
        }
    }
}

// 3. Get Branches
// @desc :: GET REQUEST
const getListOfBranches = async (req, res) => {
    try {
        const branchData = await Branch.find().populate("hodRef").populate({ path: 'teachers' })
        if (!branchData) {
            res.status(400)
            throw new Error('Some Error Occured')
        }
        console.log("branchData", branchData)
        res.status(200).json({
            success: true,
            data: {
                branchList: branchData,
            },
            msg: 'Successfully Branch List Fetched',
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

// 4. Assign Hods to Branch
// @desc :: POST REQUEST
const assignHOD = async (req, res) => {
    try {
        const { id, branchName } = req.body;
        if (!id || !branchName) {
            res.status(400)
            throw new Error('Incomplete Information')
        }
        const userData = await Teacher.findOne({ _id: id })
        if (!userData) {
            res.status(400)
            throw new Error('Invalid User ID, No User with gived Id Exist');
        }
        const branchData = await Branch.findOne({ name: branchName })
        if (!branchData) {
            res.status(400)
            throw new Error('Branch Details not found');
        }
        // remove previous user from isHod
        const previousHodData = await Teacher.findOne({ hodRef: branchData?.hodRef })
        if (previousHod) {
            previousHodData.isHod = false;
            const updatePreviousHodData = await previousHodData.save();
            if (!updatePreviousHodData) {
                throw new Error('Some Error Occured')
            }
        }
        // update branch hodRef to new User
        branchData.hodRef = id;
        if (!branchData?.teachers?.includes(id)) {
            branchData.teachers.push(id)
        }
        const updatedBranchData = await branchData.save();
        if (!updatedBranchData) {
            res.status(400)
            throw new Error('Branch Details could not be updated')
        }

        // Update User Details
        userData.isHod = true;
        userData.branchName = branchName;
        await userData.save()

        res.status(200).json({
            success: true,
            data: {
                branchData: updatedBranchData
            },
            msg: 'HOD Appointed Successfully'
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

// 5. Get List of Unverified Teachers
// @desc :: GET REQUEST
const getListOfUnverifiedTeachers = async (req, res) => {
    try {
        const { branchName } = req.query;
        let query;
        if (branchName) {
            query = { isVerified: false, branchName: branchName }
        }
        else {
            query = { isVerified: false }
        }
        const teacherList = await Teacher.find(query)
        //    console.log('teacher list',teacherList)
        res.status(200).json({
            success: true,
            data: {
                teacherList: teacherList,
            },
            msg: 'Unverified Teachers List fetched successfully'
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

// 6. Fetch Detail By Id
// @desc :: GET REQUEST
const fetchDetailsById = async (req, res) => {
    try {
        const userType = req.query.userType
        const userId = req.query.id
        const userDetails = await userType.findOne({ _id: userId })
        res.status(200).json({
            success: true,
            data: {
                userData: userDetails,
            },
            msg: 'User Details fetched successfully',

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

// 7. Verify Teacher
const verifyTeacherByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const teacherData = await Teacher.findOne({ _id: id })
        if (!teacherData) {
            res.status(400)
            throw new Error('Teacher Data not found')
        }
        teacherData.isVerified = true;
        const savedTeacherData = await teacherData.save()
        res.status(200).json({
            success: true,
            msg: 'Teacher Verified Successfully',
            data: savedTeacherData
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

// 8. Get List Of Issue
const getListOfIssues = async (req, res) => {
    try {
        const issueList = await Admin.find({}).populate({
            path: 'issueSubmittedByStudent',
            select: ['-password']
        })
        if (!issueList) {
            throw new Error('Some Error Occured while fetching students list')
        }
        res.status(200).json({
            msg: 'Issues fetched successfully',
            data: issueList,
            success: true,
        })
    }
    catch (err) {
        console.log(`Error occured ${err}`);
        return res.status(500).json({
            success: false,
            error: `${err}`,
        });
    }
}

// 9. Resolve Issue
const resolveIssue = async (req, res) => {
    try {
        const { issueId, title } = req.body;
        const getIssueById = await Admin.findOne({ _id: issueId })
        if (!getIssueById) {
            throw new Error('Issue not found')
        }
        getIssueById.status = true;
        getIssueById.isAttended = true;
        if (title)
            getIssueById.title = title;
        const savedIssue = await getIssueById.save();
        if (!savedIssue) {
            throw new Error('Some error occurred while saving the issue');
        }
        res.status(200).json({
            success: true,
            msg: 'Issue updated successfully',
            data: savedIssue,
        })

    }
    catch (err) {
        console.log(`Error occured ${err}`);
        return res.status(500).json({
            success: false,
            error: `${err}`,
        });
    }
}
module.exports = { testAdmin, adminAuth, createBranch, getListOfBranches, assignHOD, getListOfUnverifiedTeachers, fetchDetailsById, verifyTeacherByAdmin, getListOfIssues, resolveIssue }