const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TeacherSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        collegeIdCard: {
            type: String,
            required: true,
        },
        profileImg: {
            type: String,
            default:
                "https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png",
        },
        branchName: {
            type: String,
            enum: ['cse', 'it', 'ece', 'eee', 'me', 'ce','ee'],
            required: true,
        },
        branchRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
        },
        passCode: {
            type: String,
        },
        mobileNumber: {
            type: String,
        },
        isSectionHead: {
            type: Boolean,
            default: false,
        },
        isHod: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        sectionHeadRef:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
        },
        myTasks:[{
            title: {
                type: String,
                required: true,
            },
            desc:{
                type:String,
            },
            createdBy:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Teacher'
            },
            deadline:{
                type: Date,
            },
            status:{
                type: String,
                enum:['0','1','2'],
                default: '0'
            }
        }]
    },
    {
        timestamps: true,
    }
);


TeacherSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

TeacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;