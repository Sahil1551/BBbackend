const Router=require('express').Router();
const Contact=require('../models/ContactUs')
Router.post('/postQuery',async(req,res)=>{
    const {name,email,query}=req.body;
    try{
    const newQuery=new Contact({
            name,
            email,
            query,
        })
        await newQuery.save();
        return res.status(201).json({newQuery});
    }
    catch(err){
        return res.status(500).json({msg:err.message});    
    }

})



module.exports=Router