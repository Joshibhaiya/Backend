const bcrypt = require('bcrypt');
const { createToken } = require("../utility/utilities");
const { users } = require("../models/User");
const { validationResult } = require('express-validator');
const {uploadImages} = require('../utility/utilities');

const Signin = async (req, res) => {
    try {
        // Validate request body for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find the user by email
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid User" });
        }

        // Check if userStatus is not 0 (inactive)
        if (user.userStatus !== 1) {
            return res.status(403).json({ message: 'User account is not active.' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ error: 'Invalid username or password' });
        }

        // Generate token
        const token = createToken(user._id, user.role, "2h");

        // Set token and role in cookies
        res.cookie('token', token, { httpOnly: true }); 

        res.status(200).json({ userId: user._id, role: user.role, message: "Signin Success" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const Signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { userName, email, password, confirmPassword, contact, address, role, city, district, state, pincode } = req.body;

        if (!userName || !email || !password || !confirmPassword || !contact || !address || !role || !city || !district || !state || !pincode) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const imagePaths = req.imagePaths || []; // Get image paths from the validator

        const result = await users.create({
            userName,
            email,
            password: hashedPassword,
            contact,
            address,
            role,
            city,
            district,
            state,
            pincode,
            deviceImages: imagePaths
        });

        // Generate token
        const token = createToken(result._id, result.role, "2h");

        // Set token in cookies
        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({ userId: result._id, role: result.role, message: "Signup Success" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};










const Signout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Signout Success' });
};

const Home = async (req, res) => {
    res.json({ message: "Hello" });
};

// get all users by admin

const getUsers = async (req, res) => {
    try {
        if(req.user.role!== 'admin' && req.user.role!=='subadmin' ){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await users.find();
        res.status(200).json({ message: "Users fetched successfully.", result: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// get user by id via admin

const getUsersById = async (req, res) => {
    try {
       
        const user = await users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: "User fetched successfully.", user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const patchUser = async (req, res) => {
    try {
        if (req.user.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }
        const user = await users.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: "User updated successfully.", user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUserStatus = async (req, res) => {
    try { 
        if(req.user.role!== 'admin'){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await users.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: "User updated successfully.", user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createSubadmin = async (req, res) => {
    try {
        
        const { username, email, password, role } = req.body;

        // Validate input
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Username, email,role, and password are required.' });
        }

        // Create new subadmin
        const newSubadmin = new Subadmin({
            username,
            email,
            password, // You should hash the password before saving in production
            role
        });

        // Save subadmin to database
        await newSubadmin.save();

        res.status(201).json({ message: 'Subadmin created successfully.', subadmin: newSubadmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
};

module.exports = { Home, Signin, Signup, Signout, getUsers, getUsersById, patchUser, createSubadmin, updateUserStatus };
