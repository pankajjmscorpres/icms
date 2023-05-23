const Branch = require('../models/branch')
const Teacher = require('../models/teacher')
const Student = require("../models/student")
const generateToken = require('../utils/generate-token')
const Section = require('../models/section')
const Admin = require('../models/admin')


// 0.Test Student
// @desc :: GET REQUEST
const testStudent = (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Student APIs working properly'
    })
}


// 1. Auth Student
const authStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('req.body', req.body)
        if (!email || !password) {
            res.status(400)
            throw new Error("Some Fields are missing")
        }
        let user = await Student.findOne({ email: email });
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                msg: 'Successfully LoggedIn',
                data: {
                    user,
                    token: generateToken(user?._id),
                    userStatus:'student'
                }
            })
        }
        else {
            throw new Error("Invalid email or password");
        }
    }
    catch (err) {
        let error = `${err}`.split(":");
        let message;
        if (error[0] === "Error") {
            message = error[1];
        } else {
            message = "Failed to login";
        }
        res.json({ success: false, msg: message });
        res.status(400);
    }
}

// 2. Register Student
// @desc :: POST REQUEST
const registerStudent = async (req, res) => {
    try {
        const { email, password, firstName, lastName, branchName, year, sectionRef, collegeIdCard, admissionNumber, universityRollNumber, images } = req.body;
        if (!email || !password || !firstName || !lastName || !branchName || !year || !sectionRef || !collegeIdCard || !admissionNumber) {
            res.status(400)
            throw new Error("Some Fields are missing");
        }
        const sectionData = await Section.findOne({ _id: sectionRef })
        console.log(year != sectionData.sectionYear)
        if (!sectionData || year != sectionData?.sectionYear || branchName != sectionData?.sectionBranchName) {
            res.status(400)
            throw new Error("Invalid section data");
        }
        const student = new Student({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            branchName: branchName,
            year: year,
            sectionRef: sectionRef,
            collegeIdCard: collegeIdCard,
            admissionNumber: admissionNumber,
            universityRollNumber: universityRollNumber || "null",
            sampleImages: [...images],
        })
        const savedStudentData = await student.save()
        if (!savedStudentData) {
            res.status(400)
            throw new Error("Some Error Occurred,pls try again");
        }
        sectionData.sectionStudents.push(savedStudentData._id)
        const savedSectionData = await sectionData.save();
        if (!savedSectionData) {
            await Student.deleteOne({ _id: savedStudentData._id })
            res.status(400)
            throw new Error("Some Error Occurred,Pls Try Again")
        }
        res.status(201).json({
            success: true,
            msg: 'Registration Successfull',
            data: {
                user: savedStudentData,
                token: generateToken(savedStudentData._id),
                userStatus:'student'
            }
        })
    }
    catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            // Duplicate user
            return res.status(422).json({ success: false, msg: 'User already exist!' });
        }
        else {
            res.status(400).json({ success: false, error: `${err}` })
        }
    }
}


// 3. Update Student Profile
// @desc :: PUT REQUEST
const updateStudentProfile = async (req, res) => {
    try {
        const { id, password, firstName, lastName } = req.body;
        const studentData = await Student.findOne({ _id: id })
        if (!studentData) {
            throw new Error('Internal Server Error')
        }
        studentData.password = password;
        studentData.firstName = firstName || studentData.firstName
        studentData.lastName = lastName || studentData.lastName
        studentData.profileImg = profileImg || studentData.profileImg
        const updatedStudentData = await studentData.save();
        res.status(200).json({
            success: true,
            data: updatedStudentData,
            msg: "Profile Updated Successfully"
        })
    }
    catch (err) {
        let error = `${err}`.split(":");
        let message;
        if (error[0] === "Error") {
            message = error[1];
        } else {
            message = "Failed to login";
        }
        res.status(400);
        res.json({ success: false, msg: message });
    }
}

// 4. Upload Sample Images of Student
const uploadSampleImageStudent = async (req, res) => {
    try {
        const { images, studentId } = req.body;
        if (!studentId) throw new Error('Student Details Missing')
        if (images?.length === 0) throw new Error('Error While Uploading Images')
        const studentData = await Student.findOne({ _id: studentId })
        if (!studentData) throw new Error('Incorrect Student Id')
        // push images to sample images collection
        studentData.sampleImages = [...images];
        // studentData?.sampleImages?.push(img2)
        // studentData?.sampleImages?.push(img3)

        // save uploaded images
        const updatedStudentData = await studentData.save()
        if (!updatedStudentData) throw new Error('Student Details could not be updated')
        res.status(200).json({
            success: true,
            msg: 'Image Uplaoded Successfully',
            data: updatedStudentData
        })

    }
    catch (err) {
        let error = `${err}`.split(":");
        let message;
        if (error[0] === "Error") {
            message = error[1];
        } else {
            message = "Error Occurred While Adding Images";
        }
        res.status(400);
        res.json({ success: false, msg: message });
    }
}

// 5. Raise A Ticket to support
// Raise A Query Related To Any Issue
// Option - To Hod
// Option - To Class Cordinator
// Choice will be there
const studentSupport = async (req, res) => {
    try {
        const { studentId, issueMsg, typeOfIssue, priority, title } = req.body;
        // proiority will be optional
        // not madatory for student
        // to fill
        if (!studentId || !issueMsg || !typeOfIssue) {
            throw new Error("Some fields are missing")
        }
        const studentData = await Student.findOne({ _id: studentId })
        if (!studentData) {
            throw new Error('Student details not found')
        }
        // 1 - admin
        // 2 - HOD
        // 3 - Class cordinator

        // for admin
        // separate tab will be create for admin issues
        // admin can assing issues to any hod
        if (typeOfIssue === 1) {
            const newIssue = new Admin(
                {
                    issueMsg: issueMsg,
                    issueSubmittedByStudent: studentId,
                    priority: priority || 0,
                    title: title || '',
                }
            )
            const savedIssue = await newIssue.save()
            if (!savedIssue) {
                throw new Error("Some error occured,Pls try again")
            }
            res.status(201).json({
                success: true,
                msg: 'Issue Submitted Successfully',
                data: savedIssue
            })
        }
        // for hod 
        // we will be saving issue to corresponding branch 
        // using branch filter we will show issues to hod in corresponding
        // my branch tab
        else if (typeOfIssue === 2) {
            const branchName = studentData?.branchName
            if (!branchName) {
                throw new Error('Branch Details Missing')
            }
            const branchData = await Branch.findOne({ branchName: branchName })
            // console.log('studentD',branchData)
            if (!branchData) {
                throw new Error('Branch Data Missing')
            }
            const newIssue = {
                issueMsg: issueMsg,
                issueSubmittedByStudent: studentId,
                priority: priority || '1',
                title: title || '',
            }
            branchData.issues.push(newIssue)
            // console.log('studentD',branchData)
            const updatedBranchData = await branchData.save()
            if (!updatedBranchData) {
                console.log('updated', updatedBranchData)
                throw new Error("Some error occured,Pls try again")
            }
            res.status(201).json({
                success: true,
                msg: 'Issue Submitted Successfully',
                data: updatedBranchData
            })
        }
        // for class cordinator
        // we will be saving issue to corresponding section
        // using branch filter we will show issues to section in corresponding
        // my section tab
        else {
            const sectionId = studentData?.sectionRef
            if (!sectionId) {
                throw new Error('Section Details Missing')
            }
            const sectionData = await Section.findOne({ _id: sectionId })
            // console.log('section',sectionData)
            if (!sectionData) {
                throw new Error('Section Data Missing')
            }
            // new issues
            const newIssue = {
                issueMsg: issueMsg,
                issueSubmittedByStudent: studentId,
                priority: priority || 0,
                title: title || '',
            }

            sectionData.issues.push(newIssue)
            const updatedSectionData = await sectionData.save();
            console.log('section', updatedSectionData)
            if (!updatedSectionData) {
                throw new Error("Some error occured,Pls try again")
            }
            res.status(201).json({
                success: true,
                msg: 'Issue Submitted Successfully',
                data: updatedSectionData
            })
        }
    }
    catch (err) {
        console.log('err', err)
        let error = `${err}`.split(":");
        let message;
        if (error[0] === "Error") {
            message = error[1];
        } else {
            message = "Internal Server Error";
        }
        res.status(400);
        res.json({ success: false, msg: message });
    }
}

// 6. My Updates
// flow will be teacher will push updates
// subscribers will pull updates 
// on the basis of push - pull approach
// not going with web socket for now will complicate thing for POC

// Future Scope ::
// Can use web socket to create a room for section where every student and section head can connect with each other
const myUpdates = async (req, res) => {
    try {
        const { id: studentId } = req.params;
        if (!studentId) {
            throw new Error('Student Id missing')
        }
        const studentData = await Student.findOne({ _id: studentId })
        if (!studentData) {
            throw new Error('Student Details not found')
        }
        const sectionRef = studentData?.sectionRef
        const sectionData = await Section.findOne({ _id: sectionRef }).populate({
            path: 'updates.createdBy',
            select:['-password']
        })
        if (!sectionData) {
            throw new Error('Section Data Missing')
        }
        const myUpdates = sectionData?.updates || ''
        res.status(200).json({
            success: true,
            msg: 'Updates fetched successfully',
            data: myUpdates
        })
    }
    catch (err) {
        let error = `${err}`.split(":");
        let message;
        if (error[0] === "Error") {
            message = error[1];
        } else {
            message = "Failed to login";
        }
        res.status(400);
        res.json({ success: false, msg: message });
    }
}

module.exports = { testStudent, authStudent, registerStudent, updateStudentProfile, uploadSampleImageStudent, studentSupport, myUpdates }