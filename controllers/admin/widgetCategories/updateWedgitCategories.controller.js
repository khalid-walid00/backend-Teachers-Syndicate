const { WidgetCategory } = require("../../../models/schema");

const updateWidgetCategory = async (req, res) => {
  const { id } = req.params;
  const { title, type, template, data, order, page, schema } = req.body;

  try {
    if (!title || !type || !template || !page) {
      return res.status(400).json({ message: "حقول مطلوبة ناقصة" });
    }

    const widgetCategory = await WidgetCategory.findByIdAndUpdate(
      id,
      { title, type, template, data, order, page, schema },
      { new: true } 
    );

    if (!widgetCategory) {
      res.status(404);
      throw new Error("الفئة غير موجودة");
    }

    res.sendSuccess(widgetCategory, "تم تحديث الفئة بالكامل بنجاح");
  } catch (error) {
    console.error(error);
    res.sendError("حدث خطأ أثناء تحديث الفئة", 500, error);
  }
};

const patchWidgetCategory = async (req, res) => {
  const { id } = req.params;
  const partialUpdates = req.body;

  try {
    const widgetCategory = await widgetCategory.findByIdAndUpdate(id, partialUpdates, { new: true });

    if (!widgetCategory) {
      res.status(404);
      throw new Error("الفئة غير موجودة");
    }

    res.sendSuccess(widgetCategory, "تم تعديل الفئة جزئياً بنجاح");
  } catch (error) {
    console.error(error);
    res.sendError("حدث خطأ أثناء تعديل الفئة", 500, error);
  }
};

module.exports = { patchWidgetCategory, updateWidgetCategory };
