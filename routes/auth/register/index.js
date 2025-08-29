var express = require('express');
const { register, verifyOtp,resendCode } = require('../../../controllers/auth/register.controller');
var router = express.Router();
 
router.route('/').post(register)
router.route('/verify').post(verifyOtp)
router.route('/resendCode').post(resendCode)


module.exports = router;
