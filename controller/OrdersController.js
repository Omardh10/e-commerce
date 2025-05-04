const asynchandler = require('express-async-handler');
const { validatecreateorder, Order } = require('../models/Order');
const { Prudect } = require('../models/Prudect');

const NewOrder = asynchandler(async (req, res) => {

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

})

const GetOrders = asynchandler(async (req, res) => {

    const orders = await Order.find().populate("user", ["_id", "username", "birthdate"]);
    res.status(200).json({ status: "success", orders });
})

const GetSingleOrder = asynchandler(async (req, res) => {

    const order = await Order.findById(req.params.id).populate("user", ["_id", "username", "birthdate"]);
    if (!order) {
        return res.status(404).json({ message: "this order not found" })
    } else {
        res.status(200).json({ status: "success", order });
    }
})

const UpdateOrder = asynchandler(async (req, res) => {

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
})

const DeleteOrder = asynchandler(async (req, res) => {

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
})

module.exports = {
    GetOrders,
    GetSingleOrder,
    UpdateOrder,
    DeleteOrder,
    NewOrder
}