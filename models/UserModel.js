const mongoose=require('mongoose')
const UserSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:true
    },

    isVerified:{
        type:Boolean,
        default:false
    },
    Phone_number:{
        type:Number,
        required:true,
        unique:true,
        match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']

    }
    
},
{
    timestamps:true
}
)
module.exports=mongoose.model('User',UserSchema);