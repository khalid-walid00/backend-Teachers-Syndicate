const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'معرّف المستخدم مطلوب']
    },
    otp: {
        type: String,
        required: [true, 'رمز التحقق مطلوب'],
        trim: true
    },
    expiresAt: {
        type: Date,
        required: [true, 'تاريخ انتهاء الرمز مطلوب']
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = otpSchema;
