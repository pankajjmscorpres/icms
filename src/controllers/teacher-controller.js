const { query } = require('express')
const Branch = require('../models/branch')
const Section = require('../models/section')
const Teacher = require('../models/teacher')
const generateToken = require('../utils/generate-token')
// 0. Test Teacher 
const testTeacher = (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Teacher APIs working properly'
    })
}

// 1. Auth Teacher
// @desc :: POST REQUEST
const authTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(401)
            throw new Error('Some Fields are missing')
        }
        const user = await Teacher.findOne({ email });
        let branchData;
        if (user && (await user.matchPassword(password))) {
            console.log('user', user)
            if (user?.isHod) {
                branchData = await Branch.findOne({ name: user.branchName })
            }
            res.status(200).json({
                success: true,
                msg: "Successfully LoggedIn",
                data: {
                    _id: user?._id,
                    user: {
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        email: user?.email,
                        collegeIdCard: user?.collegeIdCard,
                        profileImg: user?.profileImg,
                        branchName: user?.branchName,
                        mobileNumber: user?.mobileNumber,
                        branchData: branchData,
                        isSectionHead: user?.isSectionHead,
                        sectionHeadRef: user?.sectionHeadRef || '',
                    },
                    isSectionHead: user?.isSectionHead,
                    sectionHeadRef: user?.sectionHeadRef || '',
                    isHod: user?.isHod,
                    myTasks: user?.myTasks,
                    token: generateToken(user?._id),
                    userStatus: 'teacher'
                },
            });
        } else {
            throw new Error("Invalid email or password");
        }
    } catch (err) {
        let error = `${err}`.split(":");
        let message;
        if (error[0] === "Error") {
            message = error[1];
        } else {
            message = "Failed to login";
        }
        res.json({ success: false, message: message });
        res.status(400);
    }
}


// 2. Register Teacher
// @desc :: POST REQUEST
const registerTeacher = async (req, res) => {
    try {
        const { email, password, firstName, lastName, collegeIdCard, branchName } = req.body;
        if (!email || !password || !firstName || !lastName || !collegeIdCard || !branchName) {
            res.status(401)
            throw new Error('Some Fields are missing')
        }
        // Check Whether Given Branch Exist
        const branchData = await Branch.findOne({ name: branchName })
        console.log(branchData)
        if (!branchData) {
            res.status(401)
            throw new Error('Branch does not exist')
        }

        const teacher = new Teacher({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            collegeIdCard: collegeIdCard,
            branchName: branchName
        })
        const savedTeacher = await teacher.save();
        if (!savedTeacher) {
            res.status(400)
            throw new Error('Some error occurred while creating accound');
        }

        // Now Update Branch Details
        // Push Teacher Id
        branchData.teachers.push(savedTeacher._id)
        const updatedBranchData = await branchData.save();
        if (!updatedBranchData) {
            res.status(400)
            throw new Error('Error Occured while pushing teachers details');
        }
        res.status(201).json({
            success: true,
            data: {
                _id: savedTeacher._id,
                user: savedTeacher,
                isHod: false,
                token: generateToken(savedTeacher._id),
                userStatus: 'teacher',
                msg: 'Account Created Successfully'
            }
        })

    }
    catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            // Duplicate Error
            return res.status(422).json({ succes: false, msg: 'Teacher with this Email already exist!' });
        }
        else {
            res.status(400).json({ error: `${err}` })
        }
    }
}

// 3. Get List of Teachers
// @desc :: GET REQUEST
const getListOfTeachers = async (req, res) => {
    try {
        const branch = req.query.branch;
        let query;
        if (branch) {
            query = { isHod: false, branchName: branch, isVerified: true }
        }
        else {
            query = {
                isHod: false,
                isVerified: true,
            }
        }
        const teacherList = await Teacher.find(query)
        if (!teacherList) {
            res.status(400)
            throw new Error('Some Error Occured')
        }
        res.status(200).json({
            success: true,
            data: {
                teacherList: teacherList,
            },
            msg: 'Successfully List Fetched',
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

// 4. Update Profile Controller
const updateProfile = async (req, res) => {
    try {
        const { userId, firstName, lastName, passCode, password, profileImg, mobileNumber } = req.body;
        if (!userId) {
            throw new Error('User Id Missing')
        }
        const user = await Teacher.findOne({ _id: userId })
        user.firstName = firstName || user.firstName
        user.lastName = lastName || user.lastName
        user.passCode = passCode || user.passCode
        user.profileImg = profileImg || user.profileImg
        user.mobileNumber = mobileNumber || user.mobileNumber
        if (password) {
            user.password = password;
        }
        const savedUser = await user.save();
        if (!savedUser) {
            throw new Error('Internal Server Error')
        }

        return res.status(201).json({
            success: true,
            data: savedUser,
            msg: 'Profile Updated Succesfully'
        });
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


// 5. Get Teacher By Id
// @desc :: GET REQUEST
const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new Error('User Id is missing')
        }
        const userData = await Teacher.findOne({ _id: id }).select('-password')
        if (!userData) {
            throw new Error('User does not exist')
        }
        res.status(200).json({
            succes: true,
            data: userData,
            msg: 'User Profile Fetched Successfully'
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

// 6. Teacher Support
// @desc :: POST REQUEST
const teacherSupport = async (req, res) => {
    try {
        const { teacherId, issueMsg, typeOfIssue, priority } = req.body;
        // proiority will be optional
        // not madatory for student
        // to fill
        if (!studentId || !issueMsg || !typeOfIssue) {
            throw new Error("Some fields are missing")
        }
        // proiority will be optional
        // not madatory for student
        // to fill
        const teacherData = await Teacher.findOne({ _id: teacherId })
        if (!teacherData) {
            throw new Error('Teacher Account not found')
        }
        // 1 - admin
        // 2 - HOD
        if (typeOfIssue === 1) {
            const newIssue = new Admin(
                {
                    issueMsg: issueMsg,
                    issueSubmittedByStudent: studentId,
                    priority: priority || 0,
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
        else {
            const branchName = teacherData?.branchName
            if (!branchName) {
                throw new Error('Branch Details Missing')
            }
            const branchData = await Branch.findOne({ branchName: branchName })
            if (!branchData) {
                throw new Error('Branch Data Missing')
            }
            const newIssue = {
                issueMsg: issueMsg,
                issueSubmittedByTeacher: teacherId,
                priority: priority || 0,
            }
            branchData.issues.push(newIssue)
            const updatedBranchData = await branchData.save();
            if (!updatedBranchData) {
                throw new Error("Some error occured,Pls try again")
            }
            res.status(201).json({
                success: true,
                msg: 'Issue Submitted Successfully',
                data: updatedBranchData
            })
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
        res.status(400);
        res.json({ success: false, msg: message });
    }
}


// 7. Share Msg To Your Class Students
const shareMsgToSection = async (req, res) => {
    try {
        const { msgTitle, msgBody, priority, type, links, createdBy, sectionId } = req.body;
        console.log('body', req.body)
        if (!msgTitle || !msgBody || !priority || !type || !links || !sectionId) {
            throw new Error('Some fields are missing')
        }
        const sectionData = await Section.findOne({ _id: sectionId })
        if (!sectionData) {
            throw new Error('Section Details are not found')
        }
        const newMsg = {
            msgTitle: msgTitle,
            msgBody: msgBody,
            priority: priority,
            type: type,
            createdBy: createdBy,
            links: links,
        }
        sectionData.updates.push(newMsg)
        const updatedSectionData = await sectionData.save();
        if (!updatedSectionData) {
            throw new Error('Some Error Occurred')
        }
        res.status(200).json({
            msg: 'Request Succesfull',
            data: sectionData,
            success: true,
        })
    }
    catch (err) {
        let error = `${err}`.split(":");
        let message = error
        res.status(400);
        res.json({ success: false, msg: message });
    }
}

// 8. Create To-Do List
const createTask = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const { title, desc = '', createdBy, status, deadline } = req.body;
        if (!teacherId || !title || !createdBy) {
            throw new Error('Some Fields are missing')
        }
        const createdByUserData = await Teacher.findOne({ _id: createdBy })
        if (!createdByUserData) {
            throw new Error('Invalid User')
        }
        // status - 0 - pending , 1- ongoing , 2- completed
        const teacherData = await Teacher.findOne({ _id: teacherId })
        if (!teacherData) {
            throw new Error('Teacher Details not found')
        }
        const newTask = {
            title: title,
            desc: desc,
            createdBy: createdBy,
            status: status ?? '0',
            ...deadline ? { deadline: deadline } : '',
        }
        teacherData.myTasks.push(newTask);
        const updatedTeacherData = await teacherData.save();
        if (!updatedTeacherData) {
            throw new Error('Some Error Occured')
        }
        res.status(200).json({
            succes: true,
            msg: 'Task Created Successfully',
            data: updatedTeacherData
        })

    }
    catch (err) {
        let error = `${err}`.split(":");
        let message = error
        res.status(400);
        res.json({ success: false, msg: message });
    }
}

// 9. Fetch Task List By Id
const fetchTaskList = async (req, res) => {
    try {
        const teacherId = req.params.id;
        if (!teacherId) {
            throw new Error('Teacher Id Missing')
        }
        const teacherData = await Teacher.findOne({ _id: teacherId })
        if (!teacherData) {
            throw new Error('Teacher Details not found')
        }
        const taskList = teacherData?.myTasks ?? []
        res.status(200).json({
            success: true,
            msg: 'Task List Fetched Successfully',
            data: taskList
        })
    }
    catch (err) {
        let error = `${err}`.split(":");
        let message = error
        res.status(400);
        res.json({ success: false, msg: message });

    }
}

// 10. Update Status of Todo List Item
// const updatedToDoListItemStatus = async (req, res) => {
//     try {
//         const itemId = req.params.id;
//         const { action } = req.body;
//     }
//     catch (err) {

//     }
// }




module.exports = { testTeacher, authTeacher, registerTeacher, getListOfTeachers, updateProfile, getTeacherById, teacherSupport, shareMsgToSection, createTask, fetchTaskList }