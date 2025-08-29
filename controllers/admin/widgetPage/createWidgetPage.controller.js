const findFieldTypeInSchema = require("../../../functions/findFieldTypeInSchema");
const { WidgetPage, Page, Widget } = require("../../../models/schema");
const { uploadFile } = require("../../../services/storage.service");
const fs = require("fs");

const createWidgetPage = async (req, res) => {
  try {
    const { widgetId, pageId, data: customData = {} } = req.body;
console.log("recxvbody", req.body);
    if (!widgetId || !pageId) {
      return res.status(400).json({ message: "widgetId و pageId مطلوبين" });
    }

    const page = await Page.findById(pageId);
    if (!page) return res.status(404).json({ message: "Page not found" });

    const widgetSource = await Widget.findById(widgetId);
    if (!widgetSource) return res.status(404).json({ message: "Widget not found" });

    let finalData = { ...widgetSource.data, ...customData };
    

    if (req.files && Object.keys(req.files).length > 0) {
      const files = Array.isArray(req.files)
        ? req.files 
        : Object.entries(req.files).flatMap(([_, arr]) => arr); 
    
      for (const file of files) {
        const fieldName = file.fieldname; 
        let fieldInfo = findFieldTypeInSchema(widgetSource.schema, fieldName);
    
        if (!fieldInfo) {
          for (const [key, value] of Object.entries(widgetSource.schema)) {
            if (value.type === "image" || value.type === "file") {
              fieldInfo = {
                type: value.type,
                isDirectField: true,
                parentField: null,
                targetField: key
              };
              break;
            }
          }
        }
    
        if (!fieldInfo || (fieldInfo.type !== "file" && fieldInfo.type !== "image")) {
          console.log(`Field ${fieldName} not found in schema or not a file/image type`);
          continue;
        }
    
        const fileUrl = await uploadFile(file.path, file.filename, file.mimetype);
        fs.unlinkSync(file.path);
    
        const targetKey = fieldInfo.targetField || fieldName;
    
        if (fieldInfo.isDirectField) {
          if (widgetSource.schema[targetKey] && widgetSource.schema[targetKey].type === "array") {
            finalData[targetKey] = [...(finalData[targetKey] || []), fileUrl];
          } else {
            finalData[targetKey] = fileUrl;
          }
        } else {
          const parentField = fieldInfo.parentField;
          if (!finalData[parentField] || !Array.isArray(finalData[parentField])) {
            console.log(`Parent field ${parentField} not found or not an array in finalData`);
            continue;
          }
          if (finalData[parentField][0]) {
            finalData[parentField][0][targetKey] = fileUrl;
          }
        }
      }
    }
    
    const widgetCopy = await WidgetPage.create({
      title: widgetSource.title,
      description: widgetSource.description,
      type: widgetSource.type,
      template: widgetSource.template,
      schema: widgetSource.schema,
      data: finalData,
      page: pageId,
      widget: widgetId,
      widgetCategory: widgetSource.widgetCategory,
      settings: widgetSource.settings,
      published: widgetSource.published,
    });

    page.widgetPage.push(widgetCopy._id);
    await page.save();
    global.io.emit("serverReload");

    res.sendSuccess(widgetCopy, "تم إنشاء نسخة من الويجت بنجاح");
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createWidgetPage,
};