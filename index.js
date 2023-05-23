const express = require("express");
const PORT = process.env.PORT || 8002;
const color = require("colors");
const databaseConnection = require("./src/database");
const expressApp = require("./express-app");

const StartServer = async () => {
	const app = express();
	await databaseConnection();

	await expressApp(app);
    
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`.yellow);
	}).on("error", (err) => {
		console.log(err);
		process.exit();
	});
};

StartServer();
