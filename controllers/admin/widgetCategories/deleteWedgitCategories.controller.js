const { WidgetCategory } = require("../../../models/schema");

const deleteWidgetCategory = async (req, res) => {
  const { id } = req.query;

  try {
    const category = await WidgetCategory.findByIdAndDelete(id);

    if (!category) {
      res.status(404);
      throw new Error("فئة الويجت غير موجودة");
    }

    res.sendSuccess(category, "تم حذف فئة الويجت بنجاح");
  } catch (error) {
    console.error(error);
    res.sendError("حدث خطأ أثناء حذف فئة الويجت", 500, error);
  }
};

module.exports = { deleteWidgetCategory };
