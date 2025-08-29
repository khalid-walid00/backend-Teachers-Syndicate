const { Widget } = require("../../../models/schema");

const updateWidget = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const widget = await Widget.findByIdAndUpdate(id, updates, { new: true });
  
      if (!widget) {
        res.status(404);
        throw new Error("الويجت غير موجود");
      }
  
      res.sendSuccess(widget, "تم تحديث الويجت بنجاح");
    } catch (error) {
      console.error(error);
      res.sendError("حدث خطأ أثناء تحديث الويجت", 500, error);
    }
  };
  

const patchWidget = async (req, res) => {
    const { id } = req.params;
    const partialUpdates = req.body;
  
    try {
      const widget = await Widget.findByIdAndUpdate(id, partialUpdates, { new: true });
  
      if (!widget) {
        res.status(404);
        throw new Error("الويجت غير موجود");
      }
  
      res.sendSuccess(widget, "تم تعديل الويجت بنجاح");
    } catch (error) {
      console.error(error);
      res.sendError("حدث خطأ أثناء تعديل الويجت", 500, error);
    }
  };
  
  module.exports = {patchWidget, updateWidget};