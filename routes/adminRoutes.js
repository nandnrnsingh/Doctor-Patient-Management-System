const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/adminCtrl');

const router = express.Router();

//GET -->Method
router.get('/getAllUsers',authMiddleware ,getAllUsersController );

//GET -->Method
router.get('/getAlldoctors',authMiddleware ,getAllDoctorsController );

//POST Acoount Status
router.post('/changeAccountStatus' , authMiddleware ,changeAccountStatusController )

module.exports = router;