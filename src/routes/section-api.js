const router = require('express').Router()
const { getSectionData, verifySectionStudents, resolveIssue, uploadAttendanceMaually, fetchAttendanceByDate } = require("../controllers/section-controller")

// // 0. Test Section
// router.route('/test').get(testSection)

// 1. Get Section Data
router.route('/get-section-data/:id').get(getSectionData)

// 2. Verify Section Students
router.route('/verify-section-student/:id').put(verifySectionStudents)

// 3. Resolve Issues
router.route('/resolve-issue/:id').put(resolveIssue)

// 4. Upload Attendance
// POST REQUEST
router.route('/upload-section-attendance').post(uploadAttendanceMaually)

// 5. Fetch Attendance By Date
// Get Request By Query
router.route('/fetch-attendance-date').get(fetchAttendanceByDate)
module.exports = router;