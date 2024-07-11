const Router = require('express').Router();
const Category = require('../models/Category');

// Create a new category
Router.post('/category', async (req, res) => {
    try {
        const { category } = req.body;

        // Check if the category already exists
        const fnd = await Category.findOne({ category });
        if (fnd) {
            return res.status(400).json({ msg: "Category already exists" });
        }

        // Create a new category
        const newCategory = new Category({ category });
        await newCategory.save();
        
        return res.status(201).json({ msg: `${category} is saved` });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
Router.get('/category',async(req,res)=>{
    try{
        const fnd=await Category.find();
        if(!fnd){
            return res.status(400).json({msg:"No Category found"})
        }
        return res.status(200).json(fnd)
    }
    catch(err){
        res.status(500).json({msg:err.message})
    }
})
// Get a category by ID
Router.get('/category/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the category by ID
        const fnd = await Category.findById(id);
        if (!fnd) {
            return res.status(404).json({ msg: "Category not found" });
        }

        return res.status(200).json(fnd);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

module.exports = Router;
