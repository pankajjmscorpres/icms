const express = require("express");
const cors = require("cors");
const apiRouter = require('./src/routes');
// const HandleErrors = require("./src/utils/error-handler");

module.exports = async (app) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(cors());
	app.use(express.static(__dirname + "/public"));
	// API ROUTES
	app.get('/',(req,res)=>{
		res.send('Server Running Properly')
	})
    app.use('/api/v1',apiRouter)
	

	// app.use(HandleErrors);
};
