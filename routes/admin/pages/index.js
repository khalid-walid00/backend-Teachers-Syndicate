var express = require('express');
const { getallPages, getonePage,getPageWidgets } = require('../../../controllers/admin/page/getPages.controller');
const { createPage } = require('../../../controllers/admin/page/createPage.controller');
const { deletePage } = require('../../../controllers/admin/page/deletePage.controller');
const { updatePage, updatePageWidgetOrder } = require('../../../controllers/admin/page/updatePage.controller');
var router = express.Router();

router.route('/getall').get(getallPages)
router.route('/getone').get(getonePage)
router.route('/getWidgets').get(getPageWidgets)
router.route('/update/pageWidgetOrder').patch(updatePageWidgetOrder)
router.route('/update').patch(updatePage)
router.route('/create').post(createPage)
router.route('/delete').delete(deletePage);


module.exports = router;
