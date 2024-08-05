const express = require('express');
const authMiddleware = require('../utility/authMiddleware');
const router = express.Router();
const { Home, Signin, Signup, Signout, getUsers, getUsersById, patchUser, getContacts, createContact, updateUserStatus} = require('../controllers/userController');
const { signupValidation, signinValidation } = require('../utility/validation');
const {upload} = require("../utility/utilities")

const { createSubadmin } = require('../controllers/userController');

router.get('/', Home);
router.post('/api/signin',upload.single("image") ,signinValidation, Signin);
router.post('/api/signup',upload.array('deviceImages', 1),signupValidation, Signup); // Use multer upload middleware for signup
router.post('/api/signout', Signout); // Add route for signout

router.get('/api/users',authMiddleware, getUsers);
router.get('/api/users/:id', authMiddleware, getUsersById);
// router.delete('/api/users/:id', deleteUser);
router.patch('/api/users/:id', authMiddleware, patchUser);



router.post('/api/createSubadmin', createSubadmin);

router.patch('/api/updateUserStatus/:id', authMiddleware, updateUserStatus);

module.exports = router;
