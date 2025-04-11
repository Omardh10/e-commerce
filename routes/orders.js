const express = require('express');
const router = express.Router();
const asynchandler = require('express-async-handler');
const { verifytoken, verifytokenandisadmin } = require('../middlwer/allverify');
const { validatecreateorder, Order } = require('../models/Order');
const { Prudect } = require('../models/Prudect');

router.get('/', verifytokenandisadmin, asynchandler(async (req, res) => {
    const orders = await Order.find().populate("user", ["_id", "username", "birthdate"]);
    res.status(200).json({ status: "success", orders });
}))

router.get('/:id', asynchandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", ["_id", "username", "birthdate"]);
    if (!order) {
        return res.status(404).json({ message: "this order not found" })
    } else {
        res.status(200).json({ status: "success", order });
    }
}))

router.post('/', verifytoken, asynchandler(async (req, res) => {
    const { error } = validatecreateorder(req.body);
    if (error) {
        return res.status(404).json({ message: error.details[0].message })
    }
    let totalprice = 0;
    for (let item of req.body.products) {
        const product = await Prudect.findById(item.product.toString());
        if (!product) {
            return res.status(403).json({ message: "product not found" });
        }
        totalprice += product.price * item.quantity
    }

    // console.log(getorder);

    let neworder = new Order({
        address: req.body.address,
        products: req.body.products,
        city: req.body.city,
        phone: req.body.phone,
        totalPrice: totalprice,
        status: req.body.status,
        user: req.user.id
    })
    await neworder.save();

    res.status(201).json({ status: "success", neworder });
}))

router.patch('/:id', verifytoken, asynchandler(async (req, res) => {
    let order = await Order.findById(req.params.id)
    if (!order) {
        return res.status(404).json({ message: "this order not found" })
    } else {
        if (req.user.id === order.user.toString()) {
            order = await Order.findByIdAndUpdate({ _id: req.params.id }, { $set: { ...req.body } }, { new: true })
            return res.status(200).json({ status: "success", order });
        } else {
            return res.status(200).json({ message: "not allwod only user" });
        }
    }
}))

router.delete('/:id', verifytoken, asynchandler(async (req, res) => {
    let order = await Order.findById(req.params.id)
    if (!order) {
        return res.status(404).json({ message: "this order not found" })
    } else {
        if (req.user.id === order.user.toString() || req.user.isAdmin) {
            order = await Order.deleteOne({ _id: req.params.id })
            return res.status(200).json({ status: "success", message: "deleted successfully" });
        } else {
            return res.status(200).json({ message: "not allwod only user" });
        }
    }
}))


module.exports = router;