const { Page } = require("../../../models/schema");

const deletePage = async (req, res) => {
    const {id} = req.query;
  
    try {
        const page = await Page.findByIdAndDelete(id);
    
        if (!page) {
          res.status(404);
          throw  new Error("الصفحة غير موجودة");
        }
  
      res.sendSuccess(page, "تم حذف الصفحة بنجاح");
    } catch (error) {
      console.error(error);
      res.sendError("حدث خطأ أثناء حذف الصفحة", 500, error);
    }
  };
  
  module.exports = { deletePage };