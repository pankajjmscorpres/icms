const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StudentSchema = mongoose.Schema(
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
        admissionNumber: {
            type: String,
            required: true,
        },
        universityRollNumber: {
            type: String,
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
            enum: ['cse', 'it', 'ece', 'eee', 'me', 'ce', 'ee'],
            default: 'it'
        },
        year: {
            type: String,
            enum: ['1', '2', '3', '4'],
            required: true,
        },
        sectionRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
        },
        passCode: {
            type: String,
        },
        mobileNumber: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        // sample images for studet
        // needed for model to operate
        sampleImages: {
            type:Array
        }
    },
    {
        timestamps: true,
    }
);


StudentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

StudentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Student Model
const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;