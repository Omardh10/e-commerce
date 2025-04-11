const mongoose = require('mongoose');
const joi = require('joi');
const Categschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    color: {
        type: String,
        trim: true,
        required: true
    },
    icon: {
        type: String
    }

}, { timestamps: true })
const validatecreatecateg = (obj) => {
    const schema = joi.object({
        name: joi.string().trim().min(2).max(100).required(),
        color: joi.string().trim().required(),
        icon: joi.string()

    })
    return schema.validate(obj)
}
const validateupdatecateg = (obj) => {
    const schema = joi.object({
        name: joi.string().trim().min(2).max(100),
        color: joi.string().trim(),
        icon: joi.string()

    })
    return schema.validate(obj)
}



const Category = mongoose.model('Category', Categschema)
module.exports = { Category, validatecreatecateg, validateupdatecateg };

