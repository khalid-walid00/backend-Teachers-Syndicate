const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'اسم المستخدم مطلوب'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب'],
        unique: true,
        trim: true
    },
    nationalId: {
        type: String,
        required: [true, 'الرقم القومي مطلوب'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'رقم الهاتف مطلوب'],
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'رقم الهاتف لا يمكن أن يكون فارغ'
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Otp' 
    },
    password: {
        type: String,
        required: [true, 'كلمة المرور مطلوبة']
    }
}, {
    timestamps: true
});

module.exports = userSchema;
