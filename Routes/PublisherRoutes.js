const express = require('express');
const router = express.Router();
const AuthenticatePublisher = require("../middlewares/authenticate");


const {registerPublisher, signInPublisher, logOutPublisher, 
    LoutOutAllDevicesPublisher, updateEmailPublisher, updateNumberPublisher, 
    UpdatePasswordPublisher, getPublisher, deletePublisherAccount, getSinglePublisher, 
    forgotPasswordPublisher, matchOTPPublisher, changePasswordOTPPublisher} = require("../Controllers/PublisherControllers")

// const {sendNotification} = require("../Controllers/PushNotifications")

// ===================== Publisher API =======================

// user Registration 
router.post('/register', registerPublisher);

// user login 
router.post("/signIn", signInPublisher); 

// user Logout
router.post("/logout", AuthenticatePublisher , logOutPublisher);

// user Logout All
router.post("/logout-all-devices", AuthenticatePublisher , LoutOutAllDevicesPublisher);

// Update Email
router.patch("/update-email/:id", AuthenticatePublisher, updateEmailPublisher);

// Update Number
router.patch("/update-number/:id", AuthenticatePublisher, updateNumberPublisher);

// Update Password
router.patch("/update-pass/:id", AuthenticatePublisher, UpdatePasswordPublisher);

//user data fetching
router.get('/fetch-publisher-data', AuthenticatePublisher , getPublisher); 

// Delete User Account
router.delete("/delete-acc/:id", AuthenticatePublisher, deletePublisherAccount);

// get single user 
router.post("/fetch-single-publisher", AuthenticatePublisher, getSinglePublisher);

// Forgot Password
router.post("/forgot-password", forgotPasswordPublisher);

// Matching the OTP
router.post("/check-otp-match", matchOTPPublisher);

// Changing Password using OTP
router.post("/change-pass-otp", changePasswordOTPPublisher);

// get All users
// router.post("/get-all-publisher", AuthenticatePublisher,  getAllUsers);

// Add FCM Token
// router.patch("/fcm-token/:id", putFCMToken );




module.exports = router;