const mongoose = require('mongoose');
const joi = require('joi');
const Prudectschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    image: {
        type: Object,
        default: {
            url: "",
            publicId: null
        },
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    category:{
        type:String,
        required:true
    },
    rating: {
        type: Number,
        default: 0
    },
    isfatured: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

}, { timestamps: true })
const validatecreatpro = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().min(3).max(100).required(),
        description: joi.string().trim().min(3).required(),
        price: joi.number().required(),
        categoryId: joi.string().required(),
        rating: joi.number().required()
    })
    return schema.validate(obj)
}
const validateupdatepro = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().min(3).max(100),
        description: joi.string().trim().min(3),
        price: joi.number(),
        categoryId: joi.string(),
        rating: joi.number(),
        isfatured: joi.bool()
    })
    return schema.validate(obj)
}


const Prudect = mongoose.model('Prudect', Prudectschema)
module.exports = { Prudect, validatecreatpro, validateupdatepro };

