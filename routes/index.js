var express = require('express');
const admin = require('./admin');
const auth = require('./auth');
const user = require('./user');
const { protect } = require('../middleware/authMiddleware');
var router = express.Router();

router.use('/auth' , auth);
router.use('/admin' , admin);
router.use('/user' ,user);
 

module.exports = router;
