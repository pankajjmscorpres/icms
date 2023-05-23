const router = require('express').Router()
const { testAdmin, adminAuth, createBranch, getListOfBranches, assignHOD, getListOfUnverifiedTeachers, fetchDetailsById, verifyTeacherByAdmin, getListOfIssues, resolveIssue } = require('../controllers/admin-controller')

// 0. TEST ROUTE
// @desc: FOR TEST PURPOSE
router.route('/test').get(testAdmin)

// 1. ADMIN AUTH
// @desc: ADMIN AUTHENTICATION
// @desc: passCode
router.route('/auth').post(adminAuth)

// 2. CREATE HOD
// @desc: CREATE HOD
router.route('/create-branch').post(createBranch)


// 3. GET BRANCHES
// @desc :: GET REQUEST
router.route('/get-branch-list').get(getListOfBranches)


// 4. ASSIGN HOD
// @desc :: POST REQUEST
router.route('/assign-hod').post(assignHOD)

// 5. UNVERIFIED TEACHERS LIST
// @desc :: GET REQUEST
router.route('/get-unverified-teacher').get(getListOfUnverifiedTeachers)

// 6. FETCH DETAILS BY ID
// @desc :: GET REQUEST
router.route('/get-detail').get(fetchDetailsById)

// 7. Verify Teacher
router.route('/verify-teacher/:id').put(verifyTeacherByAdmin)

// 8. Get List of Issues
router.route('/get-issues').get(getListOfIssues)

// 9. Resolve Issue
router.route('/resolve-issue').put(resolveIssue)

module.exports = router;

