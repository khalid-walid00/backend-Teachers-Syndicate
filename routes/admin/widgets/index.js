var express = require('express');
const { getAllWidgets, getOneWidget, getWidgetsByCategory } = require('../../../controllers/admin/widget/getWidgets.controller');
const { updateWidget } = require('../../../controllers/admin/widget/updateWidget.controller');
const { createWidget } = require('../../../controllers/admin/widget/createWidget.controller');
const { deleteWidget } = require('../../../controllers/admin/widget/deleteWidget.controller');
const upload = require('../../../middleware/upload.middleware');
var router = express.Router();

router.route('/getall').get(getAllWidgets);
router.route('/getone').get(getOneWidget);
router.route('/getWidgetsByCategory').get(getWidgetsByCategory);
router.route('/update').patch(updateWidget);
router.route('/create').post(createWidget);
router.route('/delete:id').delete(deleteWidget);

module.exports = router;
