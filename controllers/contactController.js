// controllers/contactController.js
const { Contact } = require('../models/Contact');

// Create a new contact
const createContact = async (req, res) => {
    try {
        const { email, message } = req.body;

        // Validate input
        if (!email || !message) {
            return res.status(400).json({ message: 'Email and message are required.' });
        }

        // Create a new contact instance
        const contact = new Contact({ email, message });

        // Save the new contact to the database
        await contact.save();

        res.status(201).json({ message: 'Contact created successfully.', contact });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all contacts
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ message: 'Contacts retrieved successfully.', contacts });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createContact, getAllContacts };
