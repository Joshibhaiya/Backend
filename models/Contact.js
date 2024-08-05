// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    message: {
        type: String,
        required: true,
    }
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = { Contact };
