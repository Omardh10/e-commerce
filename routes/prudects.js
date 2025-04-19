const express = require('express');
const router = express.Router();
const asynchandler = require('express-async-handler');
const { verifytokenandisadmin, verifytoken } = require('../middlwer/allverify');
const path = require('path');
const { validateupdatepro, Prudect, validatecreatpro } = require('../models/Prudect');
const fs = require('fs');
const { uploadphoto } = require('../middlwer/multer');
const { RemoveImage, UploadImage } = require('../utils/cloudinary');
const { User } = require('../models/User');
const { Category } = require('../models/Category');

/*** this is code to get all products from the database **/

router.get('/', asynchandler(async (req, res) => {
    const query = req.query;
    const limit = query.limit;
    const page = query.page;
    const category = query.category;
    const skip = (page - 1) * limit;
    let prudects;
    if (page) {
        prudects = await Prudect.find()
            .limit(limit).skip(skip).populate("categoryId", ["_id", "name", "color"])
        res.status(200).json({ status: "success", prudects })
    }
    else if (category) {
        prudects = await Prudect.find({ category })
            .populate("categoryId", ["_id", "name", "color"])
        res.status(200).json({ status: "success", prudects })
    }
    else {
        prudects = await Prudect.find().populate("categoryId", ["_id", "name", "color"]);
        res.status(200).json({ status: "success", prudects })
    }

}))

/*** thi is code to get a specific product from the database **/

router.get('/:id', asynchandler(async (req, res) => {
    const prudect = await Prudect.findById(req.params.id);
    if (!prudect) {
        return res.status(404).json({ message: "prudect not found ..." })
    }
    res.status(200).json({ status: "success", prudect }).populate("categoryId")
}))

/*** this is code to add product in database **/

router.post('/', verifytokenandisadmin, uploadphoto.single('image'), asynchandler(async (req, res) => {
    if (!req.file) {
        res.status(404).json({ message: "no file provided" })
    }
    const { error } = validatecreatpro(req.body);
    if (error) {
        res.status(404).json({ message: error.details[0].message })
    }
    const getcategoryname = await Category.findById(req.body.categoryId);
    const getusername = await User.findById(req.user.id);
    const pathimg = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await UploadImage(pathimg);
    const newprudect = new Prudect({
        title: req.body.title,
        description: req.body.description,
        categoryId: req.body.categoryId,
        category: getcategoryname.name,
        user: req.user.id,
        username: getusername.username,
        image: {
            url: result.secure_url,
            publicId: result.public_id
        },
        price: req.body.price,
        rating: req.body.rating
    })
    newprudect.save();
    res.status(201).json({ status: "success", newprudect });
    fs.unlinkSync(pathimg);
}))

/*** this is code to update the product in database **/

router.patch('/:id', verifytokenandisadmin, asynchandler(async (req, res) => {
    const { title, description, price, categoryId, rating, isfatured, stock } = req.body
    const { error } = validateupdatepro(req.body);
    if (error) {
        return res.status(404).json({ message: error.details[0].message })
    }
    const prudect = await Prudect.findById(req.params.id);
    if (!prudect) {
        return res.status(404).json({ message: "prudect not found ... " })
    }
    const updateprudect = await Prudect.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            title,
            description,
            price,
            categoryId,
            rating,
            isfatured,
            stock
        }
    }, { new: true })
    res.status(202).json({ status: "success", updateprudect })
}))

/*** this is code to the update the image for the product **/

router.patch('/upload-image/:id', verifytokenandisadmin, uploadphoto.single('image'), asynchandler(async (req, res) => {

    let prudect = await Prudect.findById(req.params.id);
    if (!prudect) {
        return res.status(404).json({ message: "prudect not found ... " })
    }
    await RemoveImage(prudect.image.publicId);
    const pathimg = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await UploadImage(pathimg);
    prudect = await Prudect.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            image: {
                url: result.secure_url,
                publicId: result.public_id
            }
        }
    }, { new: true })
    res.status(202).json({ status: "success", prudect })
    fs.unlinkSync(pathimg);
}))

/*** this is code to delete the peorduct from the database **/

router.delete('/:id', asynchandler(async (req, res) => {
    const prudect = await Prudect.findById(req.params.id);
    if (!prudect) {
        return res.status(404).json({ message: "prudect not found ..." })
    } else {
        await Prudect.findByIdAndDelete({ _id: req.params.id })
        await RemoveImage(prudect.image.publicId);
        res.status(200).json({ status: "success", message: "deleted successfully" })
    }
}))

/*** this is code add like to the product  **/

router.patch('/like/:id', verifytoken, asynchandler(async (req, res) => {
    const product = await Prudect.findById(req.body.id);
    if (!product) {
        res.status(401).json({ message: "product not found" });
    }
    islike = product.likes.find((user) => user.toString() === req.user.id);
    if (islike) {
        product = await product.findByIdAndUpdate({ _id: req.params.id }, {
            $pull: {
                likes: req.user.id
            }
        })
    } else {
        product = await product.findByIdAndUpdate({ _id: req.params.id }, {
            $push: {
                likes: req.user.id
            }
        })
        res.status(202).json({ status: "success", product })
    }
}))


module.exports = router