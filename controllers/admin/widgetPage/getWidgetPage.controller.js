const { WidgetPage } = require("../../../models/schema");

const getAllWidgetsPage = async (req, res) => {
    try {
        const { skip, limit, page } = req.pagination;
        const totalItems = await WidgetPage.countDocuments();
        const pages = Math.ceil(totalItems / limit);
        const data = await WidgetPage.find().skip(skip).limit(limit);

        if (!data) {
            res.status(404);
            throw new Error('الودجت غير موجود');
        }
        res.sendSuccess(pages, "جلب  ويدجات بنجاح");
    } catch (error) {
        console.error(error);
        res.sendError(" حدث خطاء ثناء جلب الودج", 500, error);

    }
};

const getOneWidgetPage = async (req, res) => {
    const { id } = req.query;
    try {
        const widget = await WidgetPage.findById(id);

        if (!widget) {
            res.status(404);
            throw new Error('الودجت غير موجود');
        }

        res.sendSuccess(widget, "جلب الودجت بنجاح");

    } catch (error) {
        console.error(error);
        res.sendError("حدث خطاء ثناء جلب الودج", 500, error);

    }
};
const getWidgetsByCategoryPage = async (req, res) => {
    const { id } = req.query;
    try {
        const widget = await WidgetPage.find({ widgetCategory: id });

        if (!widget) {
            res.status(404);
            throw new Error('الودجت غير موجود');
        }

        res.sendSuccess(widget, "جلب الودجت بنجاح");

    } catch (error) {
        console.error(error);
        res.sendError("حدث خطاء ثناء جلب الودج", 500, error);
         
    }
};

module.exports = {
    getAllWidgetsPage,
    getOneWidgetPage,
    getWidgetsByCategoryPage
};
