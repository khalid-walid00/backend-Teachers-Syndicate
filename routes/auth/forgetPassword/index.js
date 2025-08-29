var express = require('express');
const { forgetPassword, resetPassword } = require('../../../controllers/auth/forgetPassword.controller');
var router = express.Router();

router.route('/forgetPassword').post(forgetPassword)
router.route('/resetPassword').post(resetPassword)


module.exports = router;
