const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

exports.hashBcrypt = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
};

exports.compareBcrypt = async (password, hash) => {
    try {
        const startTime = Date.now();
        
        const isMatch = await bcrypt.compare(password, hash);
        
        const endTime = Date.now();
        
        return isMatch;
    } catch (error) {
        throw error;
    }
};