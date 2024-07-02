const mongoose = require("mongoose");

const  doctoeSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    firstName : {
        type:String,
        required : [true , 'first name is required']
    },
    lastName : {
        type:String,
        required : [true , 'last name is required']
    },
    phone:{
        type:String,
        required : [true , 'phone number is required']
    },
    email:{
        type:String,
        required : [true , 'email is required']
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required : [true , 'address is required']
    },
    specialization : {
        type:String,
        required : [true , 'specialization is required']
    },
    experience :{
        type:String,
        required : [true , 'experience is required']
    },
    feesPerCunsaltation : {
        type : Number,
        required : [true , 'fees per cunsaltation is required']
    },
    status:{
        type:String,
        default:'pending'
    },
    timings :{
        type:Object,
        required : [true , 'work timings is required']
    }
} , {timestamps : true});

const doctorModel = mongoose.model('doctors' , doctoeSchema);

module.exports = doctorModel;