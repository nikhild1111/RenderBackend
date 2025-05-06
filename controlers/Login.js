const bcrypt=require("bcrypt");

const User=require("../models/UserData");

const jwt=require("jsonwebtoken");
const { response } = require("express");

exports.Login=async(req,res)=>{
try{
    const {email,password}=req.body;

    if(!email|| !password){
        return res.status(400).json({
            success:false,
            message:"Please fill  all the details carefully ",
        })
    }


    const user=await User.findOne({email});
    if(!user){
response.status(400).json({
    success:false,
    message:"Email is not exist plase signup first "
})
    }

    // if user exist check password if password match create token
     // 3. Check password
     const isPasswordMatch = await bcrypt.compare(password, user.password);
     if (!isPasswordMatch) {
        return res.status(403).json({
          success: false,
          message: "Invalid password",
        });
      }
// as we want to create the token first difnd the payload (data) whcih we want in that token

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
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    httpOnly: true,       // ✔️ Prevents client-side JS from accessing the cookie
    sameSite: 'Lax',      // 🟡 'Lax' allows cookies in top-level navigations
    secure: false         // 🔴 Set to true **only in production with HTTPS**
  };
  

res.cookie("token",token,options).status(200).json({
    success:true,
    token,
    // use this token in the protected routes after the user get the primimum do some changes inside it
    message:"User Login Done",
})
    


}catch(err){
    console.error("Login error:", err); // Helpful in debugging
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
}
}