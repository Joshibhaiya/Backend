const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    deviceImages: [{
        type: String
    }],
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user','subadmin'],
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false // Making address optional
    },
    city: {
        type: String,
        required: false
    },
    district: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    pincode: {
        type: String,
        required: false
    },
    userStatus: {
        type: Number,
        required: true,
        enum: [0,1],
        default: 1
        
    }
});

// Create the user model
const users = mongoose.model('users', userSchema);

// Export the user model
module.exports = { users };
