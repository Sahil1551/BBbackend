const Router=require('express').Router();
const axios = require('axios');
const UserModel=require('../models/UserModel')
const Product=require('../models/Product')
const Review=require('../models/Review')
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
//http://127.0.0.1:3000
Router.post('/postReview',async(req,res)=>{
    const {user,product,review}=req.body;
    try{
    const fndUser=await UserModel.findById(user);
    const fndProduct=await Product.findById(product);
    if(!fndUser){
        return res.status(400).json({msg:"No User Found"});
    }
    if(!fndProduct){
        return res.status(400).json({msg:"No Product Found"});
    }
    const response = await axios.post('https://sentimentalanalysis-sahil1551-sahil1551s-projects.vercel.app/analyze', { review });
    const sentiment = response.data;

    // Check for negative sentiment
    if (sentiment.polarity < 0) {
        return res.status(400).json({ msg: 'Negative reviews are not allowed' });
    }
    console.log(fndProduct)
    const newReview=new Review({
            user:fndUser.username,
            product:fndProduct.name,
            review,
            Images:fndProduct.images[0]
        })
        await newReview.save();
        return res.status(201).json({newReview});
    }
    catch(err){
        return res.status(500).json({msg:err.message});    
    }

})
Router.get('/getReview',async(req,res)=>{
    try{
        const findReview=await Review.find();
        if(!findReview){
            return res.status(400).json({msg:"No Review With This User"});    
        }
        return res.status(201).json(findReview);   
    }
    catch(err){
        return res.status(500).json({msg:err.message});   

        
    }

})



module.exports=Router