const express = require("express");
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');


const connectDB = require("./config/db");

const path = require('path');

dotenv.config();

//connect database
connectDB();

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));


//routes
app.use('/nand/api/user' , require("./routes/userRoutes"));    //http://localhost/nand/api/user/
app.use('/nand/api/admin' , require("./routes/adminRoutes"));    //http://localhost/nand/api/admin/
app.use('/nand/api/doctor' , require("./routes/doctorRoutes"));    //http://localhost/nand/api/doctor/



//static files for deployment
app.use(express.static(path.join(__dirname , './client/build')))

app.get('*' , function(req,res){
    res.sendFile(path.join(__dirname , "./client/build/index.html"));
});


//listen port
const port = process.env.PORT || 8080 
app.listen(port , ()=>{
    console.log(`server is running on port ${port} and mode is ${process.env.NODE_MODE}`.bgCyan.white)
})