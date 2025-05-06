const bcrypt=require("bcrypt");

const User=require("../models/UserData");
const jwt=require("jsonwebtoken");
const { subscribe } = require("../Routes/Linksuser");

exports.Signup=async(req,res)=>{
try{

    const {name,email,password,role,phone}=req.body;
// check that user exist or not with same email
const existuser=await User.findOne({email});

if(existuser){
    return res.status(400).json({
         success:false,
        message:"User already Exists Please Enter New Email"
    });
}


// secore the password
// hash passsword can not be decript its onlt the one whay we can not convert it we can verify but not get original data
// we can get the data fromt he token using the secrete key so do not add the password in it

let hashedpassword;
try{
    // 10 is used for how many complex hasing you want mostly we use 10-12
    hashedpassword=await bcrypt.hash(password,10);
}catch(err){
    return res.status(500).json({
        success:false,
        message: "Error in hashing the password. Server Error"

    })
}


// if the password is encrypt means the user is new and email is ok so crete the new signup

const user=await User.create({
    name,email,password:hashedpassword,role,phone
})




const payload={
    email:user.email,
    id:user._id,
    role:user.role,

}


// LASTCHANSE its a secret key as our process.env is not working
let token=jwt.sign(payload,"LASTCHANSE",{
    expiresIn:"2h",
})



// imp you can send the toekn in the header or in the response body or in the cookis

// we are doing the cookis and the response

// this will set the expiry of cookes after that it will not work
const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure cookies are sent only over HTTPS in production
    sameSite: "Strict", // or "Lax"
  };
  
    // this was the most imporant as the cookis conteain the data we dont want it will be accesible by the user using documnet.cookis so we make it http only so only broser can acess it 
    // user can not access it like the other html elemnt useing the documnet model







res.cookie("token",token,options).status(200).json({
    success:true,
    token,
    // use this token in the protected routes after the user get the primimum do some changes inside it
    message:"User Signup Done",
})
  

}catch(err){
    console.error(err);
    return res.status(500).json({
        success:false,
        message:"user cannot be registred internal server problem ",
    })
    
}


}