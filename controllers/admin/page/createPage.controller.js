const { Page } = require("../../../models/schema");

const createPage = async (req, res) => {
    const { title, slug, description, status, widgetPage, meta } = req.body;
    const oldPage = await Page.findOne({ slug });
    if (oldPage) {
      return res.status(400).json({ message: "Slug already exists" });
    }
    try {
      const page = await Page.create({
        title,
        slug,
        description,
        status,
        widgetPage, 
        meta, 
      });
  
      res.sendSuccess(page, "تم إنشاء الصفحة بنجاح");
    } catch (error) {
      console.error(error);
      res.sendError("حدث خطأ أثناء إنشاء الصفحة", 500, error);
    }
  };
  
  module.exports = { createPage };