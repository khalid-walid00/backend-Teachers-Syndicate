const { Page } = require("../../../models/schema");

const getallPages = async (req, res) => {
    try {
        const { skip, limit, page } = req.pagination;
        
        const data = await Page.find().populate('widgetPage').skip(skip).limit(limit)

        if (!data) {
            res.status(404);
            throw new Error('الصفحة غير موجودة');
        }
        console.log(data);
        res.sendSuccess(data, "جلب الصفحات بنجاح");
    } catch (error) {
        console.error(error);
        res.sendError("حدث خطاءثناء جلب الصفحات", 500, error);
    }
};

const getonePage = async (req, res) => {
    const { id } = req.query;
     console.log("getonePage", id);
    try {
        const page = await Page.findById(id).populate('widgetPage');

        if (!page) {
            res.status(404);
            throw new Error('الصفحة غير موجودة');
        }

        res.sendSuccess(page, "جلب الصفحة بنجاح");

    } catch (error) {
        console.error(error);
        res.sendError("حدث خطاءثناء جلب الصفحات", 500, error);
    }
};

const getPageWidgets = async (req, res) => {
    const { id } = req.query;
     console.log("getonePage", id);
    try {
        const page = await Page.findById(id).populate('widgetPage').select('widgetPage');

        if (!page) {
            res.status(404);
            throw new Error('الصفحة غير موجودة');
        }

        res.sendSuccess(page, "جلب الصفحة بنجاح");

    } catch (error) {
        console.error(error);
        res.sendError("حدث خطاءثناء جلب الصفحات", 500, error);
    }
};

module.exports = {
    getallPages,
    getonePage,
    getPageWidgets
};