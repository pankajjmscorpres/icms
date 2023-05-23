const Task = require('../models/task')

const createTask = async (req, res) => {
    try {
        const { sectionId, taskId, date } = req.body;
        if (!sectionId || !taskId || !date) {
            throw new Error('Some Fields are missing')
        }
        const task = new Task({
            sectionId: sectionId,
            taskId: taskId,
            date: date
        })
        const savedTask = await task.save()
        if (!savedTask) {
            throw new Error('Some Error Occured')
        }
        res.status(200).json({
            success: true,
            data: savedTask,
            msg: 'Task Created Successfully',
        })
    }
    catch (err) {
        res.status(400).json({ success: false, error: `${err}`, msg: 'Error Occured While Creating Task' })
    }
}


module.exports = { createTask }