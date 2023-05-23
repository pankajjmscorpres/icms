const express = require("express");
const app = express();
const port = 3000;

app.get("/home" ,(req,res)=>{
    res.send()
})

app.listen(port, ()=>{
    console.log(`Application running on port ${port}`);
})