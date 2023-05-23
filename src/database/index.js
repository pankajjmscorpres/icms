const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/dev.env" });
const MONGODB_URI = process.env.MONGODB_URI;

const connnection = async () => {
	try {
		const connection = await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`Database connected successfully`.cyan);
	} catch (error) {
		console.log("Error while connection database".red);
		console.log(error);
		process.exit(1);
	}
};

module.exports = connnection;
