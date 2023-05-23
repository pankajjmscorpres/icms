const mongoose = require("mongoose");

// Section Schema
const SectionSchema = mongoose.Schema(
    {
        sectionBranchName: {
            type: String,
            enum: ['it', 'cse', 'ece', 'eee', 'ce', 'me', 'ee']
        },
        sectionYear: {
            type: String,
            enum: ['1', '2', '3', '4'],
            required: true,
        },
        sectionName: {
            type: String,
            enum: ['cse-1', 'cse-2', 'cse-3', 'it-1', 'it-2', 'it-3'],
            required: true,
        },
        sectionHead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true,
        },
        // List of Students of a section
        sectionStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student'
            }
        ],
        // List of Teachers of a section
        sectionTeachers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Teacher',
            }
        ],
        // Section Created By which Hod
        sectionCreatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true,
        },
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
                // enum: ['0', '1', '2'],
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
        }],
        updates: [{
            msgTitle: {
                type: String,
                required: true,
            },
            msgBody: {
                type: String,
                required: true,
            },
            priority: {
                type: String,
                // 0 - less priority
                // 1 - medium proirity
                // 2 - high prioirty
                enum: ['0', '1', '2'],
                required: true,
            },
            type: {
                type: String,
                enum: ['notice', 'subject', 'important'],
                required: true,
            },
            links: [{
                resourceType: {
                    type: String,
                    enum: ['pdf', 'img', 'link']
                },
                resourceLink: {
                    type: String,
                }
            },
            ],
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Teacher'
            },
        }],
        attendance: [{
            date: {
                type: String,
                required: true,
            },
            presentStudents: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Student",
                    unique: true,
                },
            ],
        },]
    },
    {
        timestamps: true,
    }
);


const Section = mongoose.model("Section", SectionSchema);
module.exports = Section;