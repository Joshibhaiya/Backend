const { products } = require('../models/Product');
const { users } = require('../models/User');
const {uploadImages} = require('../utility/utilities')


const createProduct = async (req, res) => {
    try {
        const { name, brand, model, description, ram, storage, camera, deviceCondition, price } = req.body;

        // Validate input
        if (!name || !brand || !model || !description || !ram || !storage || !camera || !deviceCondition || !price) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Get sellerId from the authenticated user
        const sellerId = req.user.id;

        // Check if seller exists
        const seller = await users.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found.' });
        }

        // Get image paths from the request
        const imagePaths = req.imagePaths;

        // Create a new product instance
        const result = new products({
            name,
            brand,
            model,
            description,
            ram,
            storage,
            camera,
            deviceCondition,
            price,
            sellerId: seller._id,
            deviceImages: imagePaths
        });

        // Save the new product to the database
        await result.save();

        res.status(201).json({ message: 'Product listed successfully.', result });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// get all products

const getProducts = async (req, res) => {
    try {
        // check if user is an admin
        if(req.user.role!== 'admin' && req.user.role!=='subadmin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        const result = await products.find();
        res.status(200).json({ message: 'Products retrieved successfully.', result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getProductById = async (req, res) => {
    try {
       const userId = req.user.Id;
        if (req.user.userId !== userId && req.user.role !== 'admin' && req.user.role!=='subadmin') {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        const { productsId } = req.params;
        const result = await products.findOne({productsId,status:"verified"});
        if (!result) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product retrieved successfully.', result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

    // get products by sellerId

const getProductBySellerId = async (req, res) => {
    try {
        
        if(req.user.role!== 'admin' && req.user.role!=='subadmin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        const { productId } = req.params;
        const result = await products.findOne({productId,sellerId:req.user.id});
        if (!result) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product retrieved successfully.', result });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        if(req.user.userId !== req.user.id && req.user.role!== 'admin' && req.user.role!=='subadmin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        const { productId } = req.params;
        const result = await products.findByIdAndDelete(productId);
        if (!result) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product deleted successfully.', result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const patchProduct = async (req, res) => {
    try {
        
        // check if user is user
        if(req.user.role!== 'user') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        const { productId } = req.params;
        const { name, brand, model, description, deviceImages, ram, storage, camera, deviceCondition, sellerId } = req.body;
        const result = await products.findByIdAndUpdate(productId, { name, brand, model, description, deviceImages, ram, storage, camera, deviceCondition, sellerId }, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product updated successfully.', result });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// added users role


// const { products } = require('../models/Product');

const getUnverifiedProducts = async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await products.find({ status: 'verified' });
        res.status(200).json({ message: 'Un Verified products retrieved successfully.', result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const getVerifiedProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the product with the given ID is verified
        const product = await products.findOne({ _id: productId, status: 'verified' });

        if (!product) {
            return res.status(404).json({ message: 'Product not found or not verified' });
        }

        res.status(200).json({ message: 'Verified product retrieved successfully.', product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





const updateProductStatus = async (req, res) => {
    try {
        // Check if the user is an admin
        if(req.user.role!== 'admin' || req.user.role!=='subadmin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        const { productId } = req.params;
        const { status } = req.body;

        // Check if the status is valid for update
        // if (status !== 'verified' && status !== 'verification Rejected') {
        //     return res.status(400).json({ message: 'Invalid status update.' });
        // }

        const updatedProduct = await products.findByIdAndUpdate(
            productId,
            { status },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product status updated successfully.', updatedProduct });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getUnverifiedProducts, getVerifiedProductById, updateProductStatus, createProduct, getProducts, getProductById, deleteProduct, patchProduct, getProductBySellerId };
