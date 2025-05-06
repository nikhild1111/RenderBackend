// when you will done the primum task then do this and change the role based on that 
// first user will click on the primum button 
// then cjeck for primimum by middlwer and token if not then send messhage take primum and pop it 
// then difind the take primum route and pyment way
// 

const jwt= require("jsonwebtoken");
require("dotenv").config();


// dont use two time 
// const cookieParser = require("cookie-parser");
// app.use(cookieParser()); // this line is required to access req.cookies

exports.auth=async(req,res,next)=>{

    try{
        // first extract the jwt token
        // we can get token from heder,cokkis,body if we inserted between them
    // console.log(req.cookies.token);
    const token = req.cookies.token;
    console.log("Token from cookie:", token);  // Debug log
if(!token ||token==undefined){
    return res.status(401).json({
        success:false,
        message:"Token missing ",
    })
}
// verify the token

try{
    // whtever the data whcih we store int he token we can get it using the verify method fr taht use secret key
    const decode=jwt.verify(token,"LASTCHANSE");
  

    // we are addding the decoded data in the user so we can chake the role
req.user=decode;

console.log(decode);

}
catch(err){
    return res.status(500).json({
        success:false,
        message:"token not valid",
    })
}
next();

}catch(error){
    return res.status(500).json({
        success:false,
        message:"user cannot be registred internal server problem ",
    })
}

}
exports.isAdmin=(req,res,next)=>{
    try{
        console.log(req.user);
        if(req.user.role!=="Admin"){
            return res.status(500).json({
                success:false,
                message:"token is not verify corectly ",
            })
        }
        next();
// no need to send the success at the last it will be send
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"user role not valid",
        })
    }
}