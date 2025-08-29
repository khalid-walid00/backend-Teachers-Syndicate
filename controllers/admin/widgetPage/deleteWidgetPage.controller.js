const { WidgetPage } = require("../../../models/schema");

const deleteWidgetPage = async (req, res) => {
    const { id } = req.query;
  
    try {
      const widget = await WidgetPage.findByIdAndDelete(id);
  
      if (!widget) {
        res.status(404);
        throw new Error("الويجت غير موجود");
      }
  
      res.sendSuccess(widget, "تم حذف الويجت بنجاح");
    } catch (error) {
      console.error(error);
      res.sendError("حدث خطأ أثناء حذف الويجت", 500, error);
    }
  };
  

module.exports = { deleteWidgetPage }