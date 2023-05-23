const router = require('express').Router()
const { testHOD, getListOfNotSectionHeadTeachers, getListOfSection, createBranchSection, assignSectionHead } = require('../controllers/hod-controller')

// 0. Test HOD
// @desc ::  GET REQUEST
router.route('/').get(testHOD)

// 1. Get List of Not Section Head Teachers
router.route('/get-availabel-section-head').get(getListOfNotSectionHeadTeachers)

// 2. Get List of Sections
router.route('/get-list-section').get(getListOfSection)

// 3. Create Branch Section
router.route('/create-section').post(createBranchSection)

// 4. Assign Section Head
router.route('/assign-section-head').post(assignSectionHead)


module.exports = router;