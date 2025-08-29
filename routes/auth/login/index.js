var express = require('express');
const { login } = require('../../../controllers/auth/login.controller');
var router = express.Router();

router.route('/').post(login)


module.exports = router;
