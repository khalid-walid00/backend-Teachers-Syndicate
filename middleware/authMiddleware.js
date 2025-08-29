const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'توكن مفقود أو غير صالح' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'توكن غير صالح أو منتهي' });
    }
};

module.exports = { protect };
