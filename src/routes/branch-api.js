const router = require('express').Router()
const { testBranch, getBranchDetails, getListOfSections, resolveIssue } = require('../controllers/branch-controller')


// 0. Test Branch APIs
router.route('/test').get(testBranch)

// 1. Get Branch Details
// @desc :: GET REQUEST
router.route('/get-branch-detail').get(getBranchDetails)

// 2. Get List of Sections
// @desc :: POST REQUEST
router.route('/get-section-list').post(getListOfSections)

// 3. Resolve Issue
// @desc :: PUT REQUEST
router.route('/resolve-issue/:id').put(resolveIssue)

module.exports = router;