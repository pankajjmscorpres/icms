const Section = require('../models/section');
const Student = require('../models/student');

// My Section Data
// @desc :: GET REQUEST
const getSectionData = async (req, res) => {
    try {
        const sectionHodId = req.params.id; // section Head Id
        if (!sectionHodId) {
            throw new Error('Id does not exist')
        }
        const sectionData = await Section.findOne({ sectionHead: sectionHodId }).populate({
            path: "sectionStudents",
            select: ['-password']
        }).populate({
            path: 'issues.issueSubmittedByStudent',
            select: ['-password'],
        }).populate({
            path: 'sectionHead',
            select: ['-password']
        })
        // console.log(sectionData)
        if (!sectionData) {
            throw new Error('section data not found');
        }
        const verifiedStudents = sectionData?.sectionStudents?.filter(item => item.isVerified == true);
        const unverifiedStudents = sectionData?.sectionStudents?.filter(item => item.isVerified == false);
        res.status(200).json({
            success: true,
            msg: 'Section Data fetched successfully',
            data: {
                id: sectionData._id,
                verifiedStudents: verifiedStudents,
                unverifiedStudents: unverifiedStudents,
                sectionStudents: sectionData?.sectionStudents,
                sectionTeachers: sectionData?.sectionTeachers,
                sectionHead: sectionData?.sectionHead,
                sectionBranchName: sectionData?.sectionBranchName,
                sectionYear: sectionData?.sectionYear,
                sectionName: sectionData?.sectionName,
                sectionCreatedBy: sectionData?.sectionCreatedBy,
                sectionIssues: sectionData?.issues,
                sectionUpdates: sectionData?.updates,
                sectionAttendance: sectionData?.attendance,
            }
        })
    } catch (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            // Duplicate user
            return res.status(422).json({ success: false, msg: 'User already exist!' });
        }
        else {
            res.status(400).json({ success: false, error: `${err}` })
        }
    }
}

// 2. Verify Section Students
// @desc :: PUT REQUEST
const verifySectionStudents = async (req, res) => {
    try {
        console.log(req.params.id)
        const { id } = req.params;
        if (!id) {
            throw new Error('Student Id not found')
        }
        const studentData = await Student.findOne({ _id: id })
        if (!studentData) {
            res.status(400)
            throw new Error('Some Error Occured')
        }
        studentData.isVerified = true;
        const updatedStudentData = await studentData.save()
        if (!updatedStudentData) {
            res.status(400)
            throw new Error('Some Error Occured')
        }
        res.status(200).json({
            success: true,
            msg: 'Student Data Fetched Successfully',
            data: updatedStudentData
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

// 3. Upload Students Attendance
// @desc :: POST REQUEST
const uploadAttendance = async (req, res) => {
    try {
        const { sectionId, imagesList } = req.body;
        if (!sectionId || imagesList.size() == 0) {
            res.status(400)
            throw new Error('Some Details are missing')
        }
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

// 4. Resolve Issues
const resolveIssue = async (req, res) => {
    try {
        const sectionHodId = req.params.id;
        const { issueId, title, status } = req.body;
        if (!sectionHodId || !issueId) {
            throw new Error('Some Fields are missing')
        }
        const sectionData = await Section.findOne({ sectionHead: sectionHodId })
        if (!sectionData) {
            throw new Error('Section Data missing')
        }
        const updatedSectionDataIssues = sectionData?.issues?.map(item => {
            if (String(item?._id) === String(issueId) && !item?.isAttended) {
                item.status = status;
                // issue has been picked
                item.isAttended = true;
                if (title) item.title = title
            }
            return item;
        })
        console.log('updated', updatedSectionDataIssues)
        // updated issue list
        sectionData.issues = updatedSectionDataIssues
        const updatedSectionData = await sectionData.save()
        if (!updatedSectionData) {
            throw new Error('Some Error Occured')
        }
        res.status(200).json({
            success: true,
            msg: 'Request Updated successfully',
            data: updatedSectionData,
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

// 5. Upload Attendance Manually
// @desc :: Manual Attendance Upload
const uploadAttendanceMaually = async (req, res) => {
    try {
        const { date, presentStudents, sectionId } = req.body;
        if (!date || !presentStudents || !sectionId) {
            throw new Error('Some Fields are missing')
        }
        const sectionData = await Section.findOne({ _id: sectionId })
        if (!sectionData) {
            throw new Error('Section Details not found')
        }
        const checkForAlreadyExistence = sectionData?.attendance?.filter(item =>
            new Date(item?.date).getTime() == new Date(date).getTime()
        )
        console.log(checkForAlreadyExistence)
        if (checkForAlreadyExistence?.length > 0) {
            sectionData.attendance = sectionData?.attendance?.map(item => {
                if (new Date(item?.date).getTime() == new Date(date).getTime()) {
                    item.presentStudents = presentStudents
                }
                return item;
            })
        }
        else {
            console.log("here")
            const currentAttendanceData = sectionData?.attendance || [];
            currentAttendanceData.push({
                date: date,
                presentStudents: presentStudents
            })
            sectionData.attendance = currentAttendanceData
        }
        const updatedSectionData = await sectionData.save();
        if (!updatedSectionData) {
            throw new Error('Some Error Occured')
        }
        res.status(200).json({
            success: true,
            data: updatedSectionData,
            msg: 'Attendance Uploaded Successfully'
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

// Fetch Attendance of Student By Id
// @desc :: GET REQUEST
const fetchAttendanceByStudentId = async (req, res) => {
    try {
        const studentId = req.params.id;
        if (!studentId) {
            throw new Error('Student Id not found')
        }
        const studentData = await Student.findOne({ _id: studentId })
        if (!studentData) {
            throw new Error('Student Details not found')
        }
        const sectionId = studentData?.sectionRef;
        if (!sectionId) {
            throw new Error('Section Id not found')
        }
        const sectionData = await Section.findOne({ _id: sectionId })
        if (!sectionData) {
            throw new Error('Section Details are missing')
        }
        const attendanceData = sectionData?.attendance;
        const studentAttendanceArray = [];
        attendanceData.map((item) => {
            const newObj = {
                date: item?.date,
                status: item?.presentStudents?.includes(studentId)
            }
            studentAttendanceArray.push(newObj)
            return true;
        })
        res.status(200).json({
            success: true,
            data: studentAttendanceArray,
            msg: 'Student Attendance Details Fetched'
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

// Fetch attendance details of student by section id
// @desc :: GET REQUEST
const fetchAttendanceBySectionId = async (req, res) => {
    try {
        const sectionId = req.params.id;
        if (!sectionId) {
            throw new Error('Section Id is missing')
        }
        const sectionData = await Section.findOne({ _id: sectionId })
        if (!sectionData) {
            throw new Error('Section Details Not Found')
        }
        const attendanceData = sectionData?.attendance
        res.status(200).json({
            success: true,
            data: attendanceData,
            msg: 'Section Attendance Details Fetched'
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

// Fetch Attendance By Date
const fetchAttendanceByDate = async (req, res) => {
    try {
        const { sectionId, date } = req.query;
        if (!sectionId || !date) {
            res.status = 400;
            throw new Error('Some Fields are missing')
        }
        const sectionData = await Section.findOne({ _id: sectionId })
        if (!sectionData) {
            throw new Error('Section Details are missing')
        }
        const attendanceData = sectionData?.attendance || []
        const resultDateAttendance = attendanceData?.filter(item => new Date(item?.date).getTime() == new Date(date).getTime())
        let isData = true;
        if (resultDateAttendance?.length === 0) {
            isData = false;
        }
        res.status(200).json({
            success: true,
            data: resultDateAttendance,
            msg: 'Attendance details fetched successfully',
            isData: isData,
            lastUpdatedAt: sectionData?.updatedAt
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

module.exports = { getSectionData, verifySectionStudents, uploadAttendance, resolveIssue, uploadAttendanceMaually, fetchAttendanceByDate }