const mongoose = require("mongoose");

const widgetCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    icon: {
      type: String, 
      default: "",
    },
    widgets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Widget",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = widgetCategorySchema;