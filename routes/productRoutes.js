const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById,getVerifiedProductById, deleteProduct, patchProduct, getProductBySellerId } = require('../controllers/productController');
const { getUnverifiedProducts, updateProductStatus } = require('../controllers/productController');
const authMiddleware = require('../utility/authMiddleware');
const { upload } = require("../utility/utilities");

const { productValidation, updateProductValidation } = require('../utility/validation');

router.post('/api/product',  authMiddleware, upload.array('deviceImages', 5),productValidation, createProduct); // Updated for multiple image uploads
router.get('/api/products', authMiddleware, getProducts);
router.get('/api/products/unverified', getUnverifiedProducts); // New route for fetching verified products
router.get('/api/products/:productId', authMiddleware, getProductById);
router.get('/api/products/unverified/:productId', getVerifiedProductById);
router.get('/api/products/seller/:sellerId', authMiddleware, getProductBySellerId); // Updated route for fetching products by sellerId
router.delete('/api/products/:productId', authMiddleware, deleteProduct);
router.patch('/api/products/:productId', authMiddleware, patchProduct);
router.patch('/api/products/:productId/status', updateProductValidation, authMiddleware, updateProductStatus); // New route for updating product status

module.exports = router;
