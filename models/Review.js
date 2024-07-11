const mongoose=require('mongoose')
const ReviewSchema=mongoose.Schema({
    user:{
        type:String,
        required:true,
    },
    product:{
        type:String,
        required:true
    },
    review:{
        type:String,
        required:true,
    },
    Images:[String],
},{
    timestamps:true
})
module.exports=mongoose.model('Review',ReviewSchema)