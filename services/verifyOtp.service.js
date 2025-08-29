const { Otp } = require('../models/schema');

async function verifyOtpService(userId,code) {
  
  const otpRecord = await Otp.findOne({ user: userId, otp: code });
  if (!otpRecord) {
    throw new Error("الكود غير صحيح");
  }

  if (Date.now() > otpRecord.expiresAt) {
    await Otp.deleteMany({ user: userId });
    throw new Error("انتهت صلاحية الكود، يرجى طلب كود جديد");
  }

  // await Otp.deleteMany({ user: userId });

  return {
    success: true,
  };
}

module.exports = { verifyOtpService };
