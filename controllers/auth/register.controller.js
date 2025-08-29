const { hashBcrypt } = require('../../functions/bcrypt');
const isValidEgyptianNationalId = require('../../functions/validNationalId');
const { User, Otp } = require('../../models/schema');
const generateToken = require('../../utils/jwt/sign');
const crypto = require('crypto');
const { sendResetCode } = require('../../utils/conected/email');
const { verifyOtpService } = require('../../services/verifyOtp.service');

const register = async (req, res) => {
    const { userName, phone, password, email, nationalId } = req.body;

    if (!userName || !phone || !password || !email || !nationalId) {
        return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    const trimmedPhone = phone.trim();
    const trimmedUserName = userName.trim();
    const trimmedEmail = email.trim();

    if (!isValidEgyptianNationalId(nationalId)) {
        return res.status(400).json({ message: 'الرقم القومي غير صحيح' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ phone: trimmedPhone }, { email: trimmedEmail }] });
        if (existingUser) {
            return res.status(400).json({ message: 'رقم الهاتف أو البريد مستخدم بالفعل' });
        }

        const hashedPassword = await hashBcrypt(password);

        const user = await User.create({
            userName: trimmedUserName,
            phone: trimmedPhone,
            email: trimmedEmail,
            nationalId,
            password: hashedPassword,

            isVerified: false,
        });

        const code = crypto.randomInt(1000, 9999).toString();

        await Otp.create({
            user: user._id,
            otp: code,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendResetCode(trimmedEmail, code);

        res.status(201).json({
            message: 'تم إنشاء الحساب بنجاح، يرجى التحقق من الكود المرسل على بريدك الإلكتروني',
            email: user.email,
        });
    } catch (error) {
        console.error("❌ خطأ أثناء إنشاء المستخدم:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: 'رقم الهاتف أو البريد الإلكتروني مستخدم بالفعل' });
        }

        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المستخدم' });
    }
};


const verifyOtp = async (req, res) => {
    const { phone, code, email } = req.body;
  
    if ( (!phone && !email) || !code) {
      return res.status(400).json({ message: 'يرجى إدخال رقم الهاتف او البريد الإلكتروني والكود' });
    }
  
    try {
      const user = await User.findOne({ $or: [{ phone: phone }, { email: email }] });
      if (!user) {
        return res.status(404).json({ message: 'المستخدم غير موجود' });
      }
  
      await verifyOtpService(user._id, code);
  
      user.isVerified = true;
      await user.save();
  
      const token = generateToken({ id: user._id, phone: user.phone, userName: user.userName });
  
      res.json({
        message: 'تم التحقق بنجاح',
        token,
        user: {
          _id: user._id,
          userName: user.userName,
          phone: user.phone,
          email: user.email,
        }
      });
  
    } catch (error) {
      console.error("❌ خطأ أثناء التحقق من OTP:", error.message);
      res.status(400).json({ message: error.message || 'حدث خطأ أثناء التحقق من الكود' });
    }
  };


const resendCode = async (req, res) => {
    const { email, phone } = req.body;

    if (!phone && !email) {
        return res.status(400).json({ message: 'يرجى إدخال رقم الهاتف او البريد الإلكتروني' });
    }

    try {
        const user = await User.findOne({ $or: [{ phone: phone }, { email: email }] });
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        const code = crypto.randomInt(1000, 9999).toString();

        await Otp.create({
            user: user._id,
            otp: code,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendResetCode(user.email, code);

        res.json({ message: 'تم استعادة كود التحقق بنجاح، يرجى التحقق من الكود المرسل على بريدك الإلكتروني' });
    } catch (error) {
        console.error("❌ خطأ أثناء استعادة كود التحقق:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء استعادة كود التحقق' });
    }
}

module.exports = { verifyOtp, register ,resendCode};


