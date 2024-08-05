const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getOrdersByUserId, deleteOrder, getAllOrders, updateOrderStatus} = require('../controllers/orderController');
const authMiddleware = require('../utility/authMiddleware');
const {orderCreateValidation} = require('../utility/validation');

router.post('/api/orders',orderCreateValidation, authMiddleware, createOrder);
router.get('/api/orders', authMiddleware,getAllOrders)
router.get('/api/orders/:orderId', authMiddleware, getOrderById);
router.get('/api/orders/user/:userId', authMiddleware, getOrdersByUserId);
router.delete('/api/orders/:orderId', authMiddleware, deleteOrder);
router.patch('/api/orders/:orderId', authMiddleware, updateOrderStatus)

module.exports = router;
