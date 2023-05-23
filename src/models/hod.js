const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const HODSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
        lastName:{
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
		profileImg: {
			type: String,
			default:
				"https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png",
		},
        branch: {
            type: String,
            enum : ['cs','it','ece','eee','me','cv'],
            default: 'it'
        },
        passCode:{
            type: String,
        },
        mobileNumber:{
            type: String,
        },
        
	},
	{
		timestamps: true,
	}
);


HODSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

HODSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const HOD = mongoose.model("HOD", HODSchema);
module.exports = HOD;