const mongoose = require('mongoose');
const joi = require('joi');
const Orderschema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        trim: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Prudect',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    city: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        trim: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true })
const validatecreateorder = (obj) => {
    const schema = joi.object({
        address: joi.string().trim().required(),
        products: joi.array().required(),
        city: joi.string().trim().required(),
        phone: joi.string().trim().required(),
        status: joi.string().trim().required()
    })
    return schema.validate(obj)
}
const validateupdateorder = (obj) => {
    const schema = joi.object({
        address: joi.string().trim(),
        products: joi.array(),
        city: joi.string().trim(),
        phone: joi.string().trim(),
        status: joi.string().trim()
    })
    return schema.validate(obj)
}


const Order = mongoose.model('Order', Orderschema)
module.exports = { Order, validatecreateorder, validateupdateorder };

