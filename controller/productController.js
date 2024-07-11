const Products=require('../models/Product')
const Category=require('../models/Category')
const productController={
    postProduct:async(req,res)=>{
      const {name,desc,price,images,category}=req.body
      try{
        if(!name||!desc||!price||!images||!category){
            return res.status(400).json({msg:"All Products fields Are required"});

        }
        const find=await Products.findOne({name});
        if(find){
            
        return res.status(400).json({msg:"Product Already Present"});
        }
        const findCat=await Category.findById(category)
        if(!findCat){
            return res.status(400).json({msg:"Category not  Present"});
        }
        const newProduct=new Products({
            name,
            desc,
            price,
            images,
            category
        })
        await newProduct.save();
        
        return res.status(201).json({msg:"Product saved Successfully"});
      } 
      catch(err){
        return res.status(500).json({msg:err.message});
      } 
    },
    getProduct:async(req,res)=>{
        try{
            const pr=await Products.find();
            if(!pr){
                return res.status(400).json({msg:"No Products Found"});
            }
          return res.status(201).json({pr});
        }
        catch(err){
            
        return res.status(500).json({msg:err.message});

        }

    },
    getProductbyId:async(req,res)=>{
        try{
            const {id}=req.params;
            const f=await Products.findById({id});
            if(!f){
                return res.status(400).json({msg:"No Product found "});        
            }
            return res.status(201).json({f})
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    getProductbyCategory:async(req,res)=>{
        const{ category}=req.params;
        try{

            const find=await Products.find({category});
            if(!find){
                return res.status(400).json({msg:"No Product found in this category"});        
            }
            return res.status(201).json(find);
        }

        catch(err){
            
        return res.status(500).json({msg:err.message});

        }
    }

}
module.exports=productController