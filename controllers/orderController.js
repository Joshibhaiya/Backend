const { orders } = require('../models/Order');
const { users } = require('../models/User');
const { products } = require('../models/Product');

const createOrder = async (req, res) => {
    try {
        const { products: productList, address, state, district, city, pincode } = req.body;
        const buyerId = req.user.id;

        // Fetch buyer details
        const buyer = await users.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Calculate total amount
        let totalAmount = 0;
        for (const item of productList) {
            const product = await products.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }
            totalAmount += product.price * item.quantity; // Assume `price` field exists in product schema
        }

        // Create order
        const newOrder = new orders({
            buyerId,
            products: productList,
            totalAmount,
            address: address || buyer.address,
            state: state || buyer.state,
            district: district || buyer.district,
            city: city || buyer.city,
            pincode: pincode || buyer.pincode,
            payment: req.body.payment || "cash on delivery"
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully.', order: newOrder, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// get all orders

const getAllOrders = async (req, res) => {
    try {
        // check if user is an admin
        if(req.user.role!== 'admin' && req.user.role!=='subadmin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        const result = await orders.find();
        res.status(200).json({ message: 'Orders retrieved successfully.', result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// get order by id via admin

const getOrderById = async (req, res) => {
    try {
        const userId = req.user.Id;
         if (req.user.userId !== userId && req.user.role !== 'admin' && req.user.role!=='subadmin') {
             return res.status(403).json({ message: 'Unauthorized access.' });
         }
 
         const { ordersId} = req.params;
         const result = await orders.findOne({ordersId,status:"verified"});
         if (!result) {
             return res.status(404).json({ message: 'Order not found.' });
         }
 
         res.status(200).json({ message: 'Orders retrieved successfully.', result });
     } catch (error) {
         console.error(error.message);
         res.status(500).json({ error: "Internal Server Error" });
     }
};



const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.userId !== userId && req.user.role !== 'admin' && req.user.role!=='subadmin') {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }
        
        const userOrders = await orders.find({ buyerId: userId }).populate('products.productId');
        res.status(200).json({ message: 'Orders retrieved successfully.', orders: userOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteOrder = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role!=='subadmin') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const { orderId } = req.params;
        const order = await orders.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json({ message: 'Order deleted successfully.', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// update order status

const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role!=='subadmin') {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await orders.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        order.status = status;
        await order.save();
        res.status(200).json({ message: 'Order status updated successfully.', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createOrder, getAllOrders, getOrderById, getOrdersByUserId, updateOrderStatus, deleteOrder };
