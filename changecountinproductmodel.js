// const mongoose = require("mongoose");
// const Product = require("./models/Product"); // adjust path if needed

// mongoose.connect("mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//   .then(async () => {
// const count = await Product.countDocuments({ discount: { $exists: false } });
// console.log("Products without discount:", count);



//     const result = await Product.updateMany(
//       { discount: { $exists: false } },
//       { $set: { discount: 0 } }
//     );
//     console.log("Updated:", result.modifiedCount);
//     process.exit();
//   })
//   .catch(err => console.error("Error:", err));

// const mongoose = require("mongoose");
// const Product = require("./models/Product"); // adjust the path if needed

// mongoose.connect("mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//   .then(async () => {
//     const result = await Product.updateMany(
//       { count: 1 },            // only update where count === 1
//       { $set: { count: 0 } }   // set it to 0
//     );
//     console.log(`✅ Updated ${result.modifiedCount} product(s)`);
//     process.exit();
//   })
//   .catch(err => {
//     console.error("❌ Error:", err);
//     process.exit(1);
//   });



const User=require("./models/UserData");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(async () => {
const result = await User.updateMany(
  { $or: [{ totalSpends: { $exists: false } }, { totalOrders: { $exists: false } }] },
  {
    $set: {
      totalSpends: 0,
      totalOrders: 0,
    }
  }
);

console.log("Updated Users:", result.modifiedCount);
    process.exit();
  })
  .catch(err => console.error("Error:", err));


