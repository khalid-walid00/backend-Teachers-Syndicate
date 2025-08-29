const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان الصفحة مطلوب'],
        trim: true
    },
    slug: { type: String, required: true, unique: false, lowercase: true },
    description: String,
    iconUrl: String,
    widgetPage: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'widgetPage'
        }
    ],
    meta: Object,
    isPublished: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

module.exports = pageSchema;
