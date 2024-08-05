const jwt = require('jsonwebtoken');
const { users } = require('../models/User');


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Sign in first.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await users.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.role !== decoded.role) {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        req.user = { ...decoded, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is invalid or expired. Please sign in again.' });
    }
};

module.exports = authMiddleware;
