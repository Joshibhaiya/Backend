const express = require("express");
require('dotenv').config();
const cors = require("cors");
const cookieParser = require('cookie-parser'); // Import cookie-parser
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Import order routes
const contactRoutes = require('./routes/contactRoutes');
const { connectDB } = require("./utility/db");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(express.urlencoded({ extended: true })); // Use body-parser middleware
app.use(express.static(path.join(__dirname, "uploads"))); // Use express.

const port = process.env.PORT || 4000;

app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/', orderRoutes); // Use order routes
app.use('/', contactRoutes);


connectDB();

app.listen(port, () => {
    console.log(`Server is working on port: ${port}`);
});
