const mongoose=require("mongoose");

require("dotenv").config();

exports.dbConnect=()=>{
    // The `uri` parameter to `openUri()` must be a string, got "undefined"
// this means the url to the connect is undifind
console.log(process.env.DATABASE_URL);
mongoose.connect("mongodb://localhost:27017/Shop_app")
    .then(()=>{
        console.log("Connection With the database is Done");

    }).
    catch((err)=>{
        console.log("something wrong is happend ")
        console.error(err.message);
        process.exit(1);
    })
}