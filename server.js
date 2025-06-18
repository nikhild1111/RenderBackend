const express=require("express");
const app=express();
require("dotenv").config();
const {dbConnect}=require("./Config/database")
const PORT=process.env.PORT||4000;
const path = require('path');
const cookieParser=require("cookie-parser")

const cors = require('cors'); //must add this request when send request from one port to other cors is important


// Allow requests from your frontend

const allowedOrigins = [
  'http://localhost:3000',
  'https://vercel-frontend-nine-chi.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
credentials: true, // ✅ allow cookies
}));


// app.use(cors({
//     origin: 'https://vercel-frontend-nine-chi.vercel.app', // your actual frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
//   }));

// Add this line to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to handle form-data
// this is cookie parser
app.use(cookieParser());

// Serve static files in /public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Serve images
// impoe=rtant as the server is in backend file so used the nodemon Backend/server.js for use the nodemon


// import the Links route
const productRoutes = require('./Routes/ProductRoutes');
const Links=require("./Routes/Linksuser");
const searchRoutes = require('./Routes/Filter');
const orderRoutes = require("./Routes/orderRoutes");
const addressRoutes = require('./Routes/addressRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const mailRoutes = require('./Routes/mail');
app.use('/api/cart', cartRoutes);
// whenever the request is come to the /api/v1 we will go to the Links rout and we will excute requst in that 
app.use("/api/v1",Links);
app.use('/api/addresses', addressRoutes);
app.use("/api/products", searchRoutes);
app.use('/api/productsadd', productRoutes);
app.use('/api/mail', mailRoutes);
// Routes
app.use("/api/orders", orderRoutes);





// this will do connection with database
dbConnect();

// default route
app.get('/',(req,res)=>{
    res.send(`<h1>This was an default route 6<h1>`)
})

app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`)
})
