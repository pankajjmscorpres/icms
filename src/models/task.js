const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
    taskId: {
        type: String,
        required: true,
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    },
    date: {
        type: String,
        required: true,
    },
})


// Task Model
const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;