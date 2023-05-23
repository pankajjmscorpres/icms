const mongoose = require("mongoose");

const BranchSchema = mongoose.Schema(
    {
        name: {
            type: String,
            enum: ['cse', 'it', 'ece', 'eee', 'me', 'ce', 'ee'],
            unique: true,
            required: true,
        },
        hodRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        },
        firstYear: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Section',
            }
        ],
        secondYear: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Section',
            }
        ],
        thirdYear: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Section',
            }
        ],
        fourthYear: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Section',
            }
        ],
        teachers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        }],
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        }],
        issues: [{
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
            title: {
                type: String,
            },
            isAttended: {
                type: Boolean,
                default: false,
            }
        }]
    },
    {
        timestamps: true,
    }
);




const Branch = mongoose.model("Branch", BranchSchema);
module.exports = Branch