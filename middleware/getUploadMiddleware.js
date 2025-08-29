const upload = require("./upload.middleware");
const { Widget } = require("../models/schema");

async function getUploadMiddleware(req, res, next) {
  try {
    const widgetId = req.query.widgetId || req.headers["x-widget-id"];

    if (!widgetId) {
      return next(); 
    }

    const widgetSource = await Widget.findById(widgetId);
    if (!widgetSource) {
      return res.status(404).json({ message: "Widget not found" });
    }

    const schema = widgetSource.schema;

    const fileFields = Object.keys(schema)
      .filter(key => schema[key].type === "image" || schema[key].type === "file")
      .map(key => ({ name: key }));

    const middleware = upload.fields(fileFields);
    middleware(req, res, next);

  } catch (err) {
    console.error("Upload Middleware Error:", err);
    next(err);
  }
}

module.exports = getUploadMiddleware;
