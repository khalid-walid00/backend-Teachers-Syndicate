var express = require('express');
const { getAllWidgets, getOneWidget, getWidgetsByCategory } = require('../../../controllers/admin/Widget/getWidgets.controller');
const { updateWidget } = require('../../../controllers/admin/Widget/updateWidget.controller');
const { createWidget } = require('../../../controllers/admin/Widget/createWidget.controller');
const { deleteWidget } = require('../../../controllers/admin/Widget/deleteWidget.controller');
const upload = require('../../../middleware/upload.middleware');
var router = express.Router();

router.route('/getall').get(getAllWidgets);
router.route('/getone').get(getOneWidget);
router.route('/getWidgetsByCategory').get(getWidgetsByCategory);
router.route('/update').patch(updateWidget);
router.route('/create').post(createWidget);
router.route('/delete:id').delete(deleteWidget);

module.exports = router;
