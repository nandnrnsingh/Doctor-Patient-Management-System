const appoinmentModel = require('../models/appoinmentmodel');
const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');


const getDoctorInfoController = async(req,res) =>{
    try {
        const doctor = await doctorModel.findOne({userId : req.body.userId})

        res.status(200).send({success:true , message:"Doctor Data fetched SuccessFully" , data:doctor})
    } 
    catch (error) {
        res.status(500).send({success:false ,error,message:"Error in Fetching Doctors details" });
    }
};


//update doctor profile
const updateProfileController = async(req,res) =>{
    try {
        const doctor = await doctorModel.findOneAndUpdate({userId : req.body.userId} , req.body);
        res.status(201).send({
            success:true,
            message:"Doctor Profile Updated Successfully",
            data:doctor,
        })
    } 
    catch (error) {
        res.status(500).send({success:false , error, message:"Error in updating Doctors details"})
    }
}


//get single doctor
const getDoctorByIdController = async(req,res)=>{
    try {
        const doctor = await doctorModel.findOne({_id:req.body.doctorId});
        res.status(200).send({
            success:true,
            message:"Doctor Data fetched SuccessFully",
            data:doctor
        })
    } 
    catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:"error in fetching single doctor Info"
        })
    }
}

//doctor appoinments
const doctorAppoinmentsController = async(req,res) =>{
    try {
        const doctor = await doctorModel.findOne({userId : req.body.userId})
        const appoinments = await appoinmentModel.find({doctorId : doctor._id})

        res.status(200).send({
            success: true,
            message: "Doctor Appointments fetched Successfully",
            data: appoinments,
        });
    } 
    catch (error) {
        res.status(500).send({
        success: false,
        error,
        message: "Error in Doctor Appointments",
    });
    }
}

//update status of appoinment
const updateStatusController = async(req,res) =>{
    try {
        const {appoinmentId , status} = req.body;

        const appoinments = await appoinmentModel.findByIdAndUpdate(appoinmentId , {status})

        const user = await userModel.findOne({ _id: appoinments.userId });

        const notification = user.notification;

        notification.push({
            type: "status-updated",
            message: `your appointment has been updated ${status}`,
            onCLickPath: "/doctor-appoinments",
        });

        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Status Updated",
        });
    }
     catch (error) {
        res.status(500).send({
            success:false,
            error,
            message : "Error in Update Status of Appointments"
        })
    }
}

module.exports = {
    getDoctorInfoController , 
    updateProfileController ,
     getDoctorByIdController,
     doctorAppoinmentsController,
     updateStatusController
};