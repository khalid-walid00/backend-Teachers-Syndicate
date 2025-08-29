
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const widgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, required: true },
  template: { type: String, required: true },
  schema: { type: Object, default: {} }, 
  data: { type: Object, default: {} }, 
  widgetCategory: { type: Schema.Types.ObjectId, ref: 'WidgetCategory' },
  widget: { type: Schema.Types.ObjectId, ref: 'Widget' },
  page: { type: Schema.Types.ObjectId, ref: 'Page' },
  published: { type: Boolean, default: true },
  settings: Object, 
  // revisions: [{ type: Schema.Types.ObjectId, ref: 'Revision' }],
  }, { timestamps: true });
  
  module.exports = widgetSchema;  