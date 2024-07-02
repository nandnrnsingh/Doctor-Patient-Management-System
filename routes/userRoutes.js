const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppoinmentController,
  bookingAvailabilityController,
  userAppoinmentsController
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

// routes

//Login ---> POST method
router.post("/login", loginController);

//Register ---> POST method
router.post("/register", registerController);

//Auth ----> POST method
router.post("/getUserData", authMiddleware, authController);

//Apply Doctor ----> POST method
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//Notification Doctor ----> POST method
router.post("/get-all-notification",authMiddleware, getAllNotificationController);

//Notification Doctor ----> POST method
router.post("/delete-all-notification",authMiddleware, deleteAllNotificationController);

//GET ALL DOCTORS
router.get('/getAllDoctors' , authMiddleware , getAllDoctorsController)

//BOOK APPOINMENT
router.post('/book-appoinment' ,authMiddleware , bookAppoinmentController)

//BOOKING AVAILABILITY
router.post('/booking-availability' , authMiddleware ,bookingAvailabilityController)

//GET APPOINMENTS LIST
router.get('/user-appoinments' , authMiddleware ,userAppoinmentsController)


module.exports = router;
