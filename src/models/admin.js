const mongoose = require("mongoose");

// Section Schema
const AdminSchema = mongoose.Schema({
    issueMsg: {
        type: String,
        required: true,
    },
    issueSubmittedByStudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    issueSubmittedByTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    priority: {
        type: String,
        // 0 - low priority
        // 1 - medium priority
        // 2 - high priority
        enum: ['0', '1', '2'],
        required: true,
    },
    status: {
        // true - for resolved
        // false - for pending
        type: Boolean,
        default: false,
    },
    title:{
        type: String,
    },
    isAttended: {
        type: Boolean,
        default: false,
    }
})


// Admin Model
const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;