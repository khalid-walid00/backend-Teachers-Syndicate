const { Widget } = require("../../../models/schema");

const deleteWidget = async (req, res) => {
    const { id } = req.params;
  
    try {
      const widget = await Widget.findByIdAndDelete(id);
  
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
  

module.exports = { deleteWidget }