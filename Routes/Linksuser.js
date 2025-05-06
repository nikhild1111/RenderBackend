
// this routes will be called for /api/v1
const express=require("express");
const { auth,isAdmin } =require("../middlewares/auth");
// take the instance of router
const router=express.Router();

// use the .. in the main require it gives me the error
// if you have not implemented the controler then do not add it

// const User=require("../models/UserData");

const {Signup}=require("../controlers/Signup");
const {Login}=require("../controlers/Login");

router.post("/login",Login);
router.post("/signup",Signup);


// router.get("/premium",auth, isPrimum,(req,res)=>{
//     res.json({
//         success:true,
//         message:"Welcome to the Protect Primum route ",
//     })

// })
// // if you want give the admin or user in the login form and then based on that check the admin or not by the checkboc in the form data or directly check that
router.get("/admin",auth, isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Protect admin route ",
    })
})

// mapping need to cretet
module.exports=router;