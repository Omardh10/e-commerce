const mongoose = require('mongoose');
const joi = require('joi');
const Userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 150,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 6,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    birthdate: {
        type: String,
        required: true
    },
    token:{
        type:String
    }
}, { timestamps: true })
const validateregister = (obj) => {
    const schema = joi.object({
        username: joi.string().trim().min(3).max(100).required(),
        email: joi.string().trim().min(3).max(150).required().email(),
        password: joi.string().trim().min(3).max(100).required(),
        phonenumber: joi.string().trim().required(),
        gender: joi.string().required(),
        city: joi.string().trim().required(),
        birthdate: joi.string().required()

    })
    return schema.validate(obj)
}
const validateupdateregister = (obj) => {
    const schema = joi.object({
        username: joi.string().trim().min(3).max(100),
        email: joi.string().trim().min(3).max(150).email(),
        password: joi.string().trim().min(3).max(100),
        phonenumber: joi.string().trim(),
        gender: joi.string(),
        city: joi.string().trim(),
        birthdate: joi.string()

    })
    return schema.validate(obj)
}
const validatelogin = (obj) => {
    const schema = joi.object({

        email: joi.string().trim().min(3).max(150).required().email(),
        password: joi.string().trim().min(3).max(100).required(),

    })
    return schema.validate(obj)
}


const User = mongoose.model('User', Userschema)
module.exports = { User, validateregister, validatelogin,validateupdateregister };

