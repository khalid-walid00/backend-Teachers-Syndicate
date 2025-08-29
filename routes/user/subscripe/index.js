var express = require('express');
const { register } = require('../../../controllers/auth/register.controller');
var router = express.Router();
 
router.route('/subscripe').get(register)


module.exports = router;
