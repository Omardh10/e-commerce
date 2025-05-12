const asynchandler = require('express-async-handler');
const { validatecreatecateg, Category } = require('../models/Category');


/*** post new category */
const NewCategory = asynchandler(async (req, res) => {
    const { error } = validatecreatecateg(req.body);
    if (error) {
        return res.status(404).json({ message: error.details[0].message })
    }
    const newcategory = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon
    })
    await newcategory.save();
    res.status(201).json({ status: "success", newcategory });
})

/*** get all categories */
const GetCategory = asynchandler(async (req, res) => {
    const allcateg = await Category.find();
    res.status(200).json({ status: "success", allcateg })
})

/*** get single category */
const GetSingleCategory = asynchandler(async (req, res) => {

    const categ = await Category.findById(req.params.id);
    if (!categ) {
        return res.status(404).json({ message: "this category not found" })
    }

    res.status(200).json({ status: "success", categ })
})

/*** update category */
const UpdateCategory = asynchandler(async (req, res) => {

    const categ = await Category.findById(req.params.id);
    if (!categ) {
        return res.status(404).json({ message: "this category not found" })
    }

    const { error } = validatecreatecateg(req.body);
    if (error) {
        return res.status(404).json({ message: error.details[0].message })
    }
    const updatecategory = await Category.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon
        }
    })

    res.status(201).json({ status: "success", updatecategory });
})

/*** delete category */
const DeleteCategory = asynchandler(async (req, res) => {

    const categ = await Category.findById(req.params.id);
    if (!categ) {
        return res.status(404).json({ message: "this category not found" })
    }
    await Category.deleteOne({ _id: req.params.id })
    res.status(202).json({ message: "deleted successfully" })
})




module.exports = {
    GetCategory,
    GetSingleCategory,
    NewCategory,
    UpdateCategory,
    DeleteCategory
}