const findFieldTypeInSchema = require("../../../functions/findFieldTypeInSchema");
const { WidgetPage } = require("../../../models/schema");
const { uploadFile, deleteFile } = require("../../../services/storage.service");
const fs = require("fs");

// دمج البيانات بشكل عميق
const deepMerge = (target, source) => {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};



const handleFilesUpdate = async (files, schema, finalData) => {
  const filesArray = Array.isArray(files)
    ? files
    : Object.entries(files).flatMap(([_, arr]) => arr);

  for (const file of filesArray) {
    const fieldName = file.fieldname;
    let fieldInfo = findFieldTypeInSchema(fieldName, schema);

    if (!fieldInfo) {
      for (const [key, value] of Object.entries(schema)) {
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
      const oldValue = finalData[targetKey];
      if (oldValue) {
        if (Array.isArray(oldValue)) {
          for (const oldFile of oldValue) await deleteFile(oldFile);
        } else {
          await deleteFile(oldValue);
        }
      }
      finalData[targetKey] = fileUrl;
    } else {
      const parentField = fieldInfo.parentField;
      if (!finalData[parentField] || !Array.isArray(finalData[parentField])) {
        console.log(`Parent field ${parentField} not found or not an array in finalData`);
        continue;
      }
      if (finalData[parentField][0]) {
        if (finalData[parentField][0][targetKey]) {
          await deleteFile(finalData[parentField][0][targetKey]);
        }
        finalData[parentField][0][targetKey] = fileUrl;
      }
    }
  }
};

// تحديث كامل للويجت
const updateWidgetPage = async (req, res) => {
  const { id } = req.query;
  let updates = { ...req.body };

  try {
    const widgetPage = await WidgetPage.findById(id);
    if (!widgetPage) return res.status(404).json({ message: "الويجت غير موجود" });

    let finalData = { ...widgetPage.data };
    if (updates.data) {
      finalData = deepMerge(finalData, updates.data);
      delete updates.data;
    }

    if (req.files && Object.keys(req.files).length > 0) {
      await handleFilesUpdate(req.files, widgetPage.schema, finalData);
    }

    const updatedWidget = await WidgetPage.findByIdAndUpdate(
      id,
      { ...updates, data: finalData },
      { new: true }
    );

    res.sendSuccess(updatedWidget, "تم تحديث الويجت بنجاح");
  } catch (error) {
    console.error(error);
    res.sendError("حدث خطأ أثناء تحديث الويجت", 500, error);
  }
};

// تعديل جزئي للويجت (PATCH)
const patchWidgetPage = async (req, res) => {
  const { id } = req.query;
  let partialUpdates = { ...req.body };

  try {
    const widgetPage = await WidgetPage.findById(id);
    if (!widgetPage) return res.status(404).json({ message: "الويجت غير موجود" });

    let finalData = { ...widgetPage.data };
    if (partialUpdates.data) {
      finalData = deepMerge(finalData, partialUpdates.data);
      delete partialUpdates.data;
    }

    if (req.files && Object.keys(req.files).length > 0) {
      await handleFilesUpdate(req.files, widgetPage.schema, finalData);
    }

    const updatedWidget = await WidgetPage.findByIdAndUpdate(
      id,
      { ...partialUpdates, data: finalData },
      { new: true }
    );

    global.io.emit("serverReload");
    res.sendSuccess(updatedWidget, "تم تعديل الويجت بنجاح");
  } catch (error) {
    console.error(error);
    res.sendError("حدث خطأ أثناء تعديل الويجت", 500, error);
  }
};

module.exports = { updateWidgetPage, patchWidgetPage };
