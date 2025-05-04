const express = require('express');
const { ForgotPassword, ResetPassword } = require('../controller/PasswordController');
const router = express.Router();


// Forgot Password
router.post('/forgot-password', ForgotPassword)


// Reset Password
router.post('/reset-password/:userId/:token', ResetPassword)


module.exports = router