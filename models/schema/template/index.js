const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  file: { type: String, required: true }, 
  theme: { type: Schema.Types.ObjectId, ref: 'Theme' },
  version: String,
}, { timestamps: true });

module.exports = mongoose.model('Template', TemplateSchema);
