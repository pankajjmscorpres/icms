const express = require("express");
const { testStudent, authStudent, registerStudent, updateStudentProfile, studentSupport,myUpdates, uploadSampleImageStudent } = require("../controllers/student-controllers");
const UserAuth = require("./middleweres/auth");

const router = express.Router();

// 0. Test Student
// @desc :: GET REQUEST
router.route("/test").get(testStudent)

// 1. Auth Student
// @desc :: POST REQUEST
router.route("/auth").post(authStudent)

// 2. Register Student
// @desc :: POST REQUEST
router.route("/register").post(registerStudent)

// 3. Update Student Profile
// @desc :: PUT REQUEST
router.route("/update-profile").put(updateStudentProfile)

// 4. Student Support
// @desc :: POST REQUEST
router.route("/support").post(studentSupport)

// 5. Student Updates
// @desc :: GET REQUEST
router.route('/fetch-updates/:id').get(myUpdates)

// 6. Upload Images
router.route("/upload-images").post(uploadSampleImageStudent)

module.exports = router;