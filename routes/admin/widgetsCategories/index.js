var express = require('express');
const { getAllWidgetCategories,getOneWidgetCategory } = require('../../../controllers/admin/widgetCategories/getWedgitCategories.controller');
const { updateWidgetCategory } = require('../../../controllers/admin/widgetCategories/updateWedgitCategories.controller');
const { createWidgetCategory } = require('../../../controllers/admin/widgetCategories/createWedgitCategories.controller');
const { deleteWidgetCategory } = require('../../../controllers/admin/widgetCategories/deleteWedgitCategories.controller');

var router = express.Router();

router.route('/getall').get(getAllWidgetCategories);
router.route('/getone/:id').get(getOneWidgetCategory);
router.route('/update').patch(updateWidgetCategory);
router.route('/create').post(createWidgetCategory);
router.route('/delete').delete(deleteWidgetCategory);

module.exports = router;
