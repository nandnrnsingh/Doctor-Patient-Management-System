const express = require("express");
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppoinmentsController, updateStatusController } = require("../controllers/doctorCtrl");

const router = express.Router();

//POST SINGLE DOC INFO
router.post("/getDoctorInfo" ,authMiddleware , getDoctorInfoController);

//POST UPDATE DOCTOR PROFILE
router.post("/updateProfile" ,authMiddleware , updateProfileController);

//POST GET SINGLE DOCTOR INFO
router.post("/getDoctorById" ,authMiddleware , getDoctorByIdController);

//GET Appointments
router.get('/doctor-appoinments' , authMiddleware , doctorAppoinmentsController)

//Update Status of Appoinments
router.post('/update-status' ,authMiddleware , updateStatusController)

module.exports = router;