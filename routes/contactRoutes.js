// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { createContact, getAllContacts } = require('../controllers/contactController');

router.post('/api/contact', createContact);
router.get('/api/contacts', getAllContacts);

module.exports = router;
