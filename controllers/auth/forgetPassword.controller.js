const { User, Otp } = require('../../models/schema');
const crypto = require('crypto');
const { sendResetCode } = require('../../utils/conected/email');
const { hashBcrypt } = require('../../functions/bcrypt');

// const resetCod.es = new Map(); 

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'يرجى إدخال البريد الإلكتروني' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
  await Otp.deleteMany({ user: user._id });
  const code = crypto.randomInt(1000, 9999).toString();
  Otp.create({ user: user._id, otp: code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });
  await sendResetCode(email, code);

  res.json({ message: 'تم إرسال كود إعادة التعيين إلى بريدك الإلكتروني' });
};

exports.resetPassword = async (req, res) => {
  const { email, password, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    const otpRecord = await Otp.findOne({ user: user._id, otp: code });
    if (!otpRecord) return res.status(400).json({ message: 'الكود غير صالح' });

    user.password = await hashBcrypt(password);
    await user.save();

    await Otp.deleteMany({ user: user._id });

    res.json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (error) {
    console.error("❌ خطأ أثناء استعادة كود التحقق:", error);
    res.status(500).json({ message: 'حدث خطأ أثناء استعادة كود التحقق' });
  }
};
