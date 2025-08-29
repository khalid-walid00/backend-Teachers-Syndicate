var express = require('express');
const subscripe = require('./subscripe');
var router = express.Router();

router.use('/user' , subscripe);

module.exports = router;
