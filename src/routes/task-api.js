const { createTask } = require('../controllers/task-controller')

const router = require('express').Router()

// 1. Create Task
// @desc :: POST REQUEST
router.route('/create-task').post(createTask)


module.exports = router