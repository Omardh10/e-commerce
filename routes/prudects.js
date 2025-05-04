const express = require('express');
const router = express.Router();
const { uploadphoto } = require('../middlwer/multer');
const { GetProducts, GetSingleProducts, NewProduct, UpdateProduct, UpdateImageProduct, DeleteProduct, AddLike } = require('../controller/ProductsController');
const { verifytokenandisadmin, verifytoken } = require('../middlwer/allverify');


// Get All Products
router.get('/', GetProducts)


// Get Single Products
router.get('/:id', GetSingleProducts)


// Posy New Products
router.post('/', verifytokenandisadmin, uploadphoto.single('image'), NewProduct)


// Update Product
router.patch('/:id', verifytokenandisadmin, UpdateProduct)


// Update Image Product
router.patch('/upload-image/:id', verifytokenandisadmin, uploadphoto.single('image'), UpdateImageProduct)


// Delete Product
router.delete('/:id', DeleteProduct)


// Add && Dis Like
router.patch('/like/:id', verifytoken, AddLike)


module.exports = router