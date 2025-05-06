const { type } = require("@testing-library/user-event/dist/type");
const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        enum:["Admin","User","Primium"],
        default:"User",
    },
    phone:{
        type:Number,
        require:true,
    }


})

module.exports=mongoose.model("user",userSchema);