var express = require('express');
const login = require('./login');
const register = require('./register');
const forgetPassword = require('./forgetPassword');
var router = express.Router();

router.use('/login' , login);
router.use('/register' , register);
router.use('/' , forgetPassword);

 

module.exports = router;
