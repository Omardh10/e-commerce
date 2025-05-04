const express = require('express');
const router = express.Router();
const { verifytoken, verifytokenandonlyuser, verifytokenandisadmin, verifytokenandauthorization } = require('../middlwer/allverify');
const { RegisterUser, GetSingleUser, GetUsers, LoginUser, UpdateUser, DeleteUser } = require('../controller/UsersController');


router.get('/', verifytokenandisadmin,GetUsers)

router.get('/:id', GetSingleUser)

router.post('/register', RegisterUser)

router.post('/login', LoginUser)

router.patch('/:id', verifytokenandonlyuser, UpdateUser)

router.delete('/:id', verifytokenandauthorization, DeleteUser)
module.exports = router;

