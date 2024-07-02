
const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');
const appoinmentModel = require('../models/appoinmentmodel');
const moment = require('moment')


//register
const registerController = async(req,res) =>{
     try {
        //check user exist
        const existingUser = await userModel.findOne({email:req.body.email});
        if(existingUser){
            return res.status(200).send({message:'User Already Exist' , success : false})
        }

        // hash password
        const password = req.body.password;
        //generate sale
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        req.body.password = hashedPassword;

        //create new user
        const newUser = new userModel(req.body)
        await newUser.save();  //save in db

        res.status(201).send({message : 'Register Successfully' , success : true});
     } 
     catch (error) {
        res.status(500).send({success : false , message : `Register controller ${error.message}`});
     }
}



//login
const loginController = async(req,res) =>{
    try {
      const user = await userModel.findOne({email : req.body.email})
      if(!user){
         return res.status(200).send({message : 'user not found' , success : false});
      }

      const isMatch = await bcrypt.compare(req.body.password , user.password);

      if(!isMatch){
         return res.status(200).send({message : 'password is incorrect' , success : false})
      }

      //generate token
      const token = jwt.sign({id:user._id} , process.env.JWT_SECRET ,{expiresIn : '1d'} )

      res.status(200).send({message : `Login Successfull` , success:true , token})

    } 
    catch (error) {
        res.status(500).send({message : ` Error in Login controller ${error.message}`});
    }
}

const authController = async(req,res) => {
   try {
      const user = await userModel.findById({ _id: req.body.userId });
      user.password = undefined;
      if(!user){
         return  res.status(404).send({message : 'User Not Found' , success : false })
      }

      else{
         res.status(200).send({success : true , data:user})
      }
   } 
   catch (error) {
      res.status(500).send({message : 'Auth Error' , success : false , error})
   }
}


//aplly doctor 
const applyDoctorController = async(req,res) =>{
      try {
         const newDoctor = await doctorModel({...req.body , status:'pending'});
         await newDoctor.save();

         // console.log(newDoctor);


         const adminUser = await userModel.findOne({isAdmin:true});

         const notification = adminUser.notification;

         notification.push({
            type : 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data:{
               userId : newDoctor._id,
               name : newDoctor.firstName + " " + newDoctor.lastName,
               onClickPath :'/admin/doctors',
            },
         });

         await userModel.findByIdAndUpdate(adminUser._id , {notification});
         res.status(201).send({
            success: true,
            message: "Doctor Account Applied SUccessfully",
          });
      } 
      catch (error) {
         res.status(500).send({success : false , error , message : ` Error while applying for Doctor`});
      }
}



//notification controller

const  getAllNotificationController = async(req,res)=>{
      try {
         const user = await userModel.findOne({_id : req.body.userId});

         const seennotification = user.seennotification;

         const notification = user.notification;

         seennotification.push(...notification);
         user.notification = [];

         user.seennotification = notification;

         const updatedUser = await user.save();

         res.status(200).send({success:true , message :  "all notification marked as read", data:updatedUser})
      } 
      catch (error) {
         res.status(500).send({message : "Error in notification", success:false,error});
      }
}

//delete notifications
const deleteAllNotificationController = async(req,res)=>{
      try {
         const user = await userModel.findOne({_id : req.body.userId})
         user.notification = [];
         user.seennotification = [];

         const updatedUser = await user.save();
         updatedUser.password = undefined;

         res.status(200).send({success:true , message:"Notification deleted",data:updatedUser})

      } 
      catch (error) {
         res.status(500).send({success:false ,message : 'unable to delete all notifications',error})
      }
}


//get all doctors
const getAllDoctorsController = async(req,res) =>{
   try {
      const doctors = await doctorModel.find({status:"approved"});

      res.status(200).send({success:true , message:"Doctors list fetched successfully" , data:doctors})
   } 
   catch (error) {
      res.status(500).send({
         success:false,
         error,
         message:'Error while fetching Doctors list',
      })
   }
}


//book appoinment
const bookAppoinmentController = async(req,res)=>{
   try {
       req.body.date = moment(req.body.date , 'DD-MM-YYYY').toISOString();
       req.body.time = moment(req.body.time , 'HH:mm').toISOString();
       req.body.status = "pending";

       const newAppoinment = new appoinmentModel(req.body)
       await newAppoinment.save();

      const user = await userModel.findOne({ _id: req.body.doctorInfo.userId}) 

      user.notification.push({
         type: "New-appointment-request",
         message: `A new Appointment Request from ${req.body.userInfo.name}`,
         onCLickPath: "/user/appointments",
      })

      await user.save();

      res.status(200).send({
         success:true,
         message:"Appoinment booked successfylly",
      })
   } 
   catch (error) {
      res.status(500).send({
         success:false,
         error,
         message:'Error while booking Doctors appoinments',
      })
   }
}


//booking availability
const bookingAvailabilityController = async(req,res) =>{
      try {
         const date = moment(req.body.date , 'DD-MM-YY').toISOString();
         const fromTime = moment(req.body.time , 'HH:mm').subtract(1,'hours').toISOString();
         const toTime = moment(req.body.time , 'HH:mm').add(1,'hours').toISOString();

         const doctorId = req.body.doctorId

         const appoinments = await appoinmentModel.find({doctorId , date ,time:{$gte:fromTime , $lte:toTime} })

         if(appoinments.length > 0){
            return res.status(200).send({
               success:true ,
               message:"Appoinments Not Available at this time",
             })
         }
         else{
            return res.status(200).send({
               success:true ,
               message:"Appoinment Available at this time",
            })
         }
      } 
      catch (error) {
         res.status(500).send({
            success:false,
            error,
            message:'Error while booking Doctors appoinments',
         })
      }
}

//all user appoinments 
const userAppoinmentsController = async(req,res) =>{
   try {
      const appoinments = await appoinmentModel.find({userId : req.body.userId})

      res.status(200).send({
         success:true,
         message : 'users appoinments fetchec successfully',
         data : appoinments
      })
   } 
   catch (error) {
      res.status(500).send({
         success:false,
         error,
         message:'Error in User appoinments',
      })
   }
}

module.exports = {
   loginController , 
   registerController ,
   authController,
   applyDoctorController,
   getAllNotificationController,
   deleteAllNotificationController,
   getAllDoctorsController,
   bookAppoinmentController,
   bookingAvailabilityController,
   userAppoinmentsController
};