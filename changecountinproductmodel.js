// const mongoose = require("mongoose");
// const Product = require("./models/Product"); // adjust path if needed

// mongoose.connect("mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//   .then(async () => {
//     const result = await Product.updateMany(
//       { count: { $exists: false } },
//       { $set: { count: 0 } }
//     );
//     console.log("Updated:", result.modifiedCount);
//     process.exit();
//   })
//   .catch(err => console.error("Error:", err));

const mongoose = require("mongoose");
const Product = require("./models/Product"); // adjust the path if needed

mongoose.connect("mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(async () => {
    const result = await Product.updateMany(
      { count: 1 },            // only update where count === 1
      { $set: { count: 0 } }   // set it to 0
    );
    console.log(`✅ Updated ${result.modifiedCount} product(s)`);
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
