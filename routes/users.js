const express = require('express');
const router = express.Router();
const { verifytoken, verifytokenandonlyuser, verifytokenandisadmin, verifytokenandauthorization } = require('../middlwer/allverify');
const { RegisterUser, GetSingleUser, GetUsers, LoginUser, UpdateUser, DeleteUser } = require('../controller/UsersController');


// Get All Users
router.get('/', verifytokenandisadmin, GetUsers)


// Get Single User
router.get('/:id', GetSingleUser)


// Register New User
router.post('/register', RegisterUser)


//Login Old User
router.post('/login', LoginUser)


// Update User 
router.patch('/:id', verifytokenandonlyuser, UpdateUser)


// Delete User
router.delete('/:id', verifytokenandauthorization, DeleteUser)




module.exports = router;

