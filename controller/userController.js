const User=require('../models/UserModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const nodemailer=require('nodemailer')
const tranporter=nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS
    }
})
tranporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});


const userController={
    register:async(req,res)=>{
        const {username,email,password,Phone_number}=req.body
        if(!username||!email||!password||!Phone_number){
            return res.status(400).json({msg:"All Fields are Required"});
        }
        try{
            const existinguser=await User.findOne({email});
            if(existinguser){
                return res.status(400).json({msg:"Email Already Registered"});
            }
            const existingnum= await User.findOne({Phone_number});
            if(existingnum){
                return res.status(400).json({msg:"Phone Number Already Registered"});
            }   
            const hashedpass=await bcrypt.hash(password,10)
            const NewUser=new User({
                username,
                email,
                password:hashedpass,
                Phone_number

            });
            await NewUser.save();
            const accesstoken=Createaccesstoken({id:NewUser._id});
            const refreshtoken=Createrefreshtoken({id:NewUser._id});
            res.cookie('refrestoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_token'

            })
            const generateVerificationToken = (userId) => {
                const payload = { userId };
                const secret = process.env.JWT_SECRET_KEY_GMAIL; // Use a secure and private key
                const options = { expiresIn: '1h' };
                return jwt.sign(payload, secret, options);
            };

            const sendVerificationEmail = (user, token) => {
                const verificationLink = `https://b-bbackend.vercel.app/user/verify-email?token=${token}`;

                const mailOptions = {
                    from: process.env.GMAIL,
                    to: user.email,
                    subject: 'Email Verification',
                    html: `
                    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <h1 style="text-align: center; color: #4CAF50; font-size: 24px; margin-bottom: 20px;">🎉 Email Verification 🎉</h1>
    <p style="font-size: 16px; color: #333;">Hello <strong>${user.username}</strong>,</p>
    <p style="font-size: 16px; color: #333;">Welcome to Bliss Bakers! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 25px; font-size: 16px; color: #fff; background-color: #4CAF50; border-radius: 5px; text-decoration: none; transition: background-color 0.3s ease, transform 0.3s ease; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            Verify Email
        </a>
    </div>
    <p style="font-size: 14px; color: #666;">If you did not create an account, no further action is required.</p>
    <p style="font-size: 14px; color: #666;">Best regards,</p>
    <p style="font-size: 14px; color: #666;"><strong>Bliss Bakers Team</strong></p>
</div>

<script>
    document.querySelector('a').addEventListener('mouseover', function() {
        this.style.backgroundColor = '#45a049';
        this.style.transform = 'scale(1.05)';
    });
    document.querySelector('a').addEventListener('mouseout', function() {
        this.style.backgroundColor = '#4CAF50';
        this.style.transform = 'scale(1)';
    });
</script>

                
                    `
                };

                tranporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Verification email sent: %s', info.response);
                });
            };

            const verificationToken = generateVerificationToken(NewUser._id);
            sendVerificationEmail(NewUser, verificationToken);
 
            
            res.status(201).json({accesstoken,msg:"User Succesfully saved"});

        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    verify:async(req,res)=>{
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({ msg: "Invalid token" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_GMAIL);
            const userId = decoded.userId;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ msg: "User not found" });
            }
            user.isVerified = true;
            await user.save();
            return res.redirect('https://b-bfrontend.vercel.app/Login')
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    Login:async(req,res)=>{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"Email not Found"});
        }
        const compare=await bcrypt.compare(password,user.password);
        if(!compare){
            return res.status(400).json({msg:"Password not matched"});
        }
        if(!user.isVerified){
            return res.status(400).json({msg:"user not Verified"});
        }
        const accesstoken=Createaccesstoken({id:user._id});
            const refreshtoken=Createrefreshtoken({id:user._id});
            res.cookie('refrestoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_token'

        })
        return res.status(201).json({accesstoken,msg:"User Login Successfully"});
        
    },
    
    Logout:async(req,res)=>{
        try{
            res.clearCookie('refresh_token',{path:'/user/refresh_token'});
            return res.json({msg:"Logout"});
        }
        catch(err){
            return res.status(500).json({msg:err.message})  
        }


        
    },
    info:async(req,res)=>{
        try{
            const user=await User.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg:"user not found"});
            return res.json(user);
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
   
    },
    refreshtoken:async(req,res)=>{
        const rf_token=req.cookies.refreshtoken
        if(!rf_token) return res.status(400).json({msg:"Please Login or Register"})
        jwt.verify(rf_token,process.env.JWT_SECRET_KEY_REFRESH,(err,user)=>{
            const accesstoken=Createaccesstoken({id:user.id});
                res.json({user,accesstoken});
        })
    },
    infoWithId:async(req,res)=>{
        try{
            const {id}=req.params;
            const findId=await User.findById(id);
            if(!findId){
                return res.status(400).json({msg:"User not found"});
            }
            return res.status(201).json(findId);
        }
        catch(err){
return res.status(500).json({msg:err.message});
        }
    }


}
const Createaccesstoken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET_KEY_ACCESS,{expiresIn:'1d'})        
}

const Createrefreshtoken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET_KEY_REFRESH,{expiresIn:'7d'})        
}



module.exports=userController