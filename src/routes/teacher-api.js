const router = require('express').Router()
const { testTeacher, authTeacher, registerTeacher, getListOfTeachers, updateProfile, getTeacherById, teacherSupport, shareMsgToSection, createTask, fetchTaskList } = require('../controllers/teacher-controller')

// 0. Test Teacher
// @desc :: GET REQUEST
router.route('/').get(testTeacher)

// 1. Auth Teacher
// @desc :: POST REQUEST
router.route('/auth').post(authTeacher)

// 2. Register Teacher
// @desc :: POST REQUEST
router.route('/register').post(registerTeacher)

// 3. Get List of Teachers 
// @desc :: Filter By Branch (Query Params)
// @desc :: GET REQUEST
router.route('/get-list').get(getListOfTeachers)


// 4. Update Teacher's Profile
// @desc :: PROFILE UPDATE
// @desc :: POST REQUEST
router.route("/update").put(updateProfile);

// 5. Get Teacher By Id
// @desc :: GET REQUEST BY PARAMS(ID)
router.route('/find/:id').get(getTeacherById)

// 6. Teacher Support
// @desc :: POST REQUEST
router.route('/support').post(teacherSupport)

// 7. Share Msg To Section
// @desc :: POST REQUEST
router.route('/share-msg-to-section').post(shareMsgToSection)

// 8. Create Task
// @desc :: PUT REQUEST
router.route('/create-task/:id').put(createTask)

// 9. Fetch Task List
// @desc :: GET REQUEST
router.route('/fetch-task-list/:id').get(fetchTaskList)


module.exports = router;