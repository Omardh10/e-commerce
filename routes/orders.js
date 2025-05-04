const express = require('express');
const { DeleteOrder, UpdateOrder, NewOrder, GetOrders, GetSingleOrder } = require('../controller/OrdersController');
const router = express.Router();
const { verifytoken, verifytokenandisadmin } = require('../middlwer/allverify');


// Get Orders
router.get('/', verifytokenandisadmin, GetSingleOrder)


// Get Single Order
router.get('/:id', GetOrders)


// Post New Order
router.post('/', verifytoken, NewOrder)


// Update Order
router.patch('/:id', verifytoken, UpdateOrder)


// Delete Order
router.delete('/:id', verifytoken, DeleteOrder)


module.exports = router;