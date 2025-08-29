const { Page } = require("../../../models/schema");

const updatePage = async (req, res) => {
    const { id } = req.query;
    const updates = req.body;
    console.log("updatecccs", id);
    try {
        const page = await Page.findByIdAndUpdate(id,  { $set: updates }, { new: true });

        if (!page) {
            res.status(404);
            throw new Error("الصفحة غير موجودة");
        }

        res.sendSuccess(page, "تم تحديث الصفحة بنجاح");
    } catch (error) {
        console.log("errocccr", error);
        res.sendError("حدث خطأ أثناء تحديث الصفحة", 500, error);
    }
};
const updatePageWidgetOrder = async (req, res) => {
    const { id } = req.query; 
    const { widgetPage } = req.body; 
  
    try {
      if (!Array.isArray(widgetPage)) {
        return res.sendError("قائمة الـ widgets غير صحيحة", 400);
      }
  
      const page = await Page.findByIdAndUpdate(
        id,
        { widgetPage },
        { new: true } 
      );
  
      if (!page) {
        return res.sendError("الصفحة غير موجودة", 404);
      }
      global.io.emit("serverReload");
      res.sendSuccess(page, "تم تحديث ترتيب الـ widgets بنجاح");
    } catch (error) {
      console.error("خطأ أثناء تحديث ترتيب الـ widgets:", error);
      res.sendError("حدث خطأ أثناء تحديث ترتيب الـ widgets", 500, error);
    }
  };
  
module.exports = { updatePage,updatePageWidgetOrder };

