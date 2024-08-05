const mongoose = require('mongoose');

// Collection creation
const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    payment: {
        type: String,
        default: "cash on delivery"
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["In progress", "successfull", "pending", "cancelled", "failed"],
        default: "successfull"
    },
    feedback: {
        type: String
    }
});

const orders = mongoose.model('orders', orderSchema);
module.exports = { orders };
