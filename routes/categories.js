const express = require('express');
const router = express.Router();
const { verifytokenandisadmin } = require('../middlwer/allverify');
const { DeleteCategory, UpdateCategory, NewCategory, GetSingleCategory, GetCategory } = require('../controller/CategoriesController');


// Get All Categories
router.get('/', GetCategory)



// get Single Category
router.get('/:id',GetSingleCategory)



// Post New Category
router.post('/', verifytokenandisadmin, NewCategory)



// Update Category
router.patch('/', verifytokenandisadmin, UpdateCategory)



// Delete Category
router.delete('/:id', verifytokenandisadmin,DeleteCategory)





module.exports = router