const mongoose=require('mongoose')
const Contact=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    query:{
        type:String,
        Required:true
    }
},
{
    timestamps:true
})
module.exports=mongoose.model('Contact',Contact)