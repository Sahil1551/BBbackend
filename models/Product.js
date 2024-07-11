const mongoose=require('mongoose');
const ProductSchema=mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    desc:{
        type:String,
        required:true
},
price: {
    type: Map,
    of: Number,
    required: true
    
},
    images:{
        type:[String],
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }


},{
    timestamps:true
})
module.exports=mongoose.model('Products',ProductSchema)