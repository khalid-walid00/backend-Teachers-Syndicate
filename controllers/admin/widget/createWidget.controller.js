const { Widget,  WidgetCategory } = require("../../../models/schema");
// const { uploadFile } = require("../../../services/storage.service");
// const fs = require("fs");

const createWidget = async (req, res) => {
  try {
    const { title, type, template, schema, widgetCategory } = req.body;


    if (!title || !type || !template || !widgetCategory) {
      return res.status(400).json({ message: "title, type, template, category required" });
    }

    const category = await WidgetCategory.findById(widgetCategory);
    if (!category) return res.status(404).json({ message: "Category not found" });


    const widget = await Widget.create({
      title,
      type,
      template,
      schema,
      widgetCategory,
    });


    res.sendSuccess(widget, "تم إنشاء الويجت بنجاح");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createWidget,
};
