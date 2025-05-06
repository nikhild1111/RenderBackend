const express=require("express");
const app=express();
require("dotenv").config();
const {dbConnect}=require("./Config/database")
const PORT=process.env.PORT||4000;
const path = require('path');
const cookieParser=require("cookie-parser")
const productRoutes = require('./Routes/ProductRoutes');
const cors = require('cors'); //must add this request when send request from one port to other cors is important

// ✅ Must be before routes
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  


// Add this line to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to handle form-data
// this is cookie parser
app.use(cookieParser());

// Serve static files in /public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Serve images
// impoe=rtant as the server is in backend file so used the nodemon Backend/server.js for use the nodemon


// import the Links route

const Links=require("./Routes/Linksuser")

app.use('/api/products', productRoutes);





// this will do connection with database
dbConnect();



// whenever the request is come to the /api/v1 we will go to the Links rout and we will excute requst in that 
app.use("/api/v1",Links);



// default route
app.get('/',(req,res)=>{
    res.send(`<h1>This was an default route 6<h1>`)
})



app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`)
})
