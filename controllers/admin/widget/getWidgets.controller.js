const { Widget, WidgetPage } = require("../../../models/schema");
const { getOptionsByType, getOptionsByTypeFromSchema } = require("../../../services/widgetOptions.service");

const getAllWidgets = async (req, res) => {
    try {
        const { skip, limit, page } = req.pagination;
        const totalItems = await Widget.countDocuments();
        const pages = Math.ceil(totalItems / limit);
        const data = await Widget.find({published: true}).skip(skip).limit(limit);

        if (!data) {
            res.status(404);
            throw new Error('الودجت غير موجود');
        }
        res.sendSuccess(pages, "جلب الودجات بنجاح");
    } catch (error) {
        console.error(error);
        res.sendError(" حدث خطاء ثناء جلب الودج", 500, error);

    }
};


const getOneWidget = async (req, res) => {
    const { id } = req.query;
    try {
        let widget = await Widget.findById({ _id: id, published: true }).lean();

        if (!widget) {
            res.status(404);
            throw new Error("الودجت غير موجود");
        }

        const optionsData = await getOptionsByTypeFromSchema(widget.schema);

        widget.data = {
            ...widget.data,
            ...optionsData 
        };

        res.sendSuccess(widget, "جلب الودجت بنجاح");

    } catch (error) {
        console.error(error);
        res.sendError("حدث خطأ أثناء جلب الودجت", 500, error);
    }
};

const getWidgetsByCategory = async (req, res) => {
    const { id } = req.query;
    try {
        const widget = await Widget.find({ widgetCategory: id, published: true });

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
    getAllWidgets,
    getOneWidget,
    getWidgetsByCategory
};
