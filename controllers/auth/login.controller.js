const jwt = require('jsonwebtoken');
const generateToken = require('../../utils/jwt/sign');
const { User } = require('../../models/schema');
const { compareBcrypt } = require('../../functions/bcrypt');

const login = async (req, res) => {
    const { phone, password, email } = req.body;

    try {
        const user = await User.findOne({ $or: [{ phone }, { email }] }).populate('otp');
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        if (!user.isVerified) {
            return res.status(400).json({
                message: "يرجى التحقق من رمز التحقق",
                redirectTo: `/auth?page=register&phone=${user.phone}&step=2`,
              });            
        }
       
        const isMatch = await compareBcrypt(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
        }
        const token = generateToken({ id: user._id, phone: user.phone , email: user.email });
        res.json({
            _id: user._id,
            userName: user.name,
            email: user.email,
            phone: user.phone,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
};

module.exports = { login };
