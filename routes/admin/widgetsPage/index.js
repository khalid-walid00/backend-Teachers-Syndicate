var express = require('express');
 
const upload = require('../../../middleware/upload.middleware');
const { getAllWidgetsPage , getWidgetsByCategoryPage,getOneWidgetPage} = require('../../../controllers/admin/widgetPage/getWidgetPage.controller');
const { updateWidgetPage, patchWidgetPage } = require('../../../controllers/admin/widgetPage/updateWidgetPage.controller');
const { createWidgetPage } = require('../../../controllers/admin/widgetPage/createWidgetPage.controller');
const { deleteWidgetPage } = require('../../../controllers/admin/widgetPage/deleteWidgetPage.controller');
var router = express.Router();

router.route('/getall').get(getAllWidgetsPage);
router.route('/getone').get(getOneWidgetPage);
router.route('/getWidgetsByCategory').get(getWidgetsByCategoryPage);
router.route('/update').patch(upload.any(), patchWidgetPage);
router.route('/create').post(upload.any(), createWidgetPage);
router.route('/delete').delete(deleteWidgetPage);

module.exports = router;
  