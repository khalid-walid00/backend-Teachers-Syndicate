const { WidgetCategory } = require("../../../models/schema");

const getAllWidgetCategories = async (req, res) => {
  try {
    const { skip, limit } = req.pagination; // page مش مستخدم


    const data = await WidgetCategory.find().skip(skip).limit(limit);

    if (!data || data.length === 0) {
      res.status(404);
      throw new Error("لا توجد فئات ودجات");
    }

    res.sendSuccess(
      data,
      "جلب فئات الودجات بنجاح"
    );
  } catch (error) {
    console.error(error);
    res.sendError("حدث خطأ أثناء جلب فئات الودجات", 500, error);
  }
};

const getOneWidgetCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const widgetCategory = await WidgetCategory.findById(id);

    if (!widgetCategory) {
      res.status(404);
      throw new Error("فئة الودجت غير موجودة");
    }

    res.sendSuccess(widgetCategory, "جلب فئة الودجت بنجاح");
  } catch (error) {
    console.error(error);
    res.sendError("حدث خطأ أثناء جلب فئة الودجت", 500, error);
  }
};

module.exports = {
  getAllWidgetCategories,
  getOneWidgetCategory,
};
