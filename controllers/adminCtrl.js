
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');


const getAllUsersController = async(req,res)=>{
    try {
        const users = await userModel.find({});
        res.status(200).send({success:true,message:"users data list",data:users})
    } 
    catch (error) {
        res.status(500).send({success : false , message : 'error while feching users' ,error})
    }
}

const getAllDoctorsController = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({success:true,message:"docotrs data list",data:doctors})
    } 
    catch (error) {
        res.status(500).send({success : false , message : 'error while feching doctors data' ,error})
    }
}

//Doctor Account Status
const changeAccountStatusController = async(req,res) =>{
    try {
        const {doctorId , status} = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId , {status});

        //find user and send notification
        const user = await userModel.findOne({_id : doctor.userId});

        const notification = user.notification;
        notification.push({
            type:'doctor-account-request-updated',
            message:`your doctor account status has ${status}`,
            onClickPath : '/notification'
        })

        user.isDoctor = status === "approved" ? true : false;

        await user.save();

        res.status(201).send({
            success:true,
            message:'doctor account status updated',
            data:doctor
        })
    } 
    catch (error) {
        res.status(500).send({success:false , message : 'Error in Account Status' ,error});
    }
}

module.exports = {getAllUsersController,getAllDoctorsController , changeAccountStatusController}