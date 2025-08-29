const express = require('express');
var router = express.Router();
const  pages = require('./pages');
const  widget = require('./widgets');
const  widgetsPage = require('./widgetsPage');
const  WidgetCategories = require('./widgetsCategories');


router.use('/pages' , pages);
router.use('/widget' , widget);
router.use('/widgetPage' , widgetsPage);
router.use('/widgetCategory' ,WidgetCategories );

 
module.exports = router;