const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;


const ALLOWED_IMG_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
const ALLOWED_IMG_SIZE = 5 * 1024 * 1024;

const Validatter = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const randString = (length = 10) => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

const imageValidator = async (req, res, next) => {
    if (req.files) {
        const imagePaths = [];
        for (const file of req.files) {
            const { mimetype, size } = file;
            const types = ALLOWED_IMG_TYPES;
            if (!types.includes(mimetype)) {
                return res.status(400).json({ error: 'Invalid image type.' });
            }
            if (size > ALLOWED_IMG_SIZE) {
                return res.status(400).json({ error: 'Image size exceeds limit.' });
            }
            // Upload images here and save paths
            const uniqueFilename = randString(4) + file.originalname;
            const filepath = path.join(__dirname, './uploads', uniqueFilename);
            try {
                await fs.writeFile(filepath, file.buffer);
                imagePaths.push(uniqueFilename);
            } catch (err) {
                console.error('Failed to write file:', err);
                return res.status(500).json({ error: 'Failed to save file.' });
            }
        }
        req.imagePaths = imagePaths; // Pass the paths to the next handler
    }
    next();
};


const signupValidation = [
    body('userName').notEmpty().withMessage('Name cannot be empty'),
    body('email').isEmail().withMessage('Enter your correct mail').normalizeEmail({ gmail_remove_dots: true }),
    body('contact').isLength({ min: 10, max: 10 }).withMessage('Enter a valid contact no.'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one digit')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
    imageValidator,
    Validatter
];

const signinValidation = [
    body('email').isEmail().withMessage('Enter your correct mail').normalizeEmail({ gmail_remove_dots: true }),
    body('password').notEmpty().withMessage('Password is required'),
    Validatter
];

const productValidation = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('brand').notEmpty().withMessage('Brand cannot be empty'),
    body('model').notEmpty().withMessage('Model cannot be empty'),
    body('description').notEmpty().withMessage('Description cannot be empty'),
    body('ram').notEmpty().withMessage('RAM cannot be empty'),
    body('storage').notEmpty().withMessage('Storage cannot be empty'),
    body('price').notEmpty().withMessage('Price cannot be empty').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    imageValidator, // Add image validator to product validation
    Validatter
];

const updateProductValidation = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('brand').notEmpty().withMessage('Brand cannot be empty'),
    body('model').notEmpty().withMessage('Model cannot be empty'),
    body('description').notEmpty().withMessage('Description cannot be empty'),
    body('ram').notEmpty().withMessage('RAM cannot be empty'),
    body('storage').notEmpty().withMessage('Storage cannot be empty'),
    body('price').notEmpty().withMessage('Price cannot be empty').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    Validatter
];



const orderCreateValidation = [
    body('district').notEmpty().withMessage('District cannot be empty'),
    body('address').notEmpty().withMessage('Address cannot be empty'),
    body('city').notEmpty().withMessage('City cannot be empty'),
    body('state').not().isEmpty(),
    body('pincode').not().isEmpty().isPostalCode('IN'),
    Validatter

];


module.exports = { signupValidation, signinValidation, productValidation, updateProductValidation, orderCreateValidation };