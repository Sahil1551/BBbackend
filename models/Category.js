const mongoose=require('mongoose')
const Category=mongoose.Schema({
    category:{
        type:String,
    }
},
{
    timestamps:true
})
module.exports=mongoose.model('Category',Category)