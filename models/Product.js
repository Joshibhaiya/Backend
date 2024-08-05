const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    },
    storage: {
        type: String,
        required: true
    },
    camera: {
        type: String,
        required: true
    },
    deviceCondition: {
        type: String,
        enum: ["minor scratches", "major scratches", "minor dent", "major dent", "paint chipoff"],
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending for verification", "verified", "verification Rejected"],
        default: "verified"
    },
    deviceImages: [{
        type: String
    }]
});

const products = mongoose.model('products', productSchema);
module.exports = { products };
