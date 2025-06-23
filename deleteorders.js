const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/UserData');

// Replace with your actual MongoDB connection string
mongoose.connect('mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("✅ Connected to MongoDB");

  try {
    // Get valid product and user IDs
    const validProductIds = await Product.distinct('_id');
    const validUserIds = await User.distinct('_id');

    // Delete orders where productId or userId is not in valid list
    const result = await Order.deleteMany({
      $or: [
        { productId: { $nin: validProductIds } },
        { userId: { $nin: validUserIds } },
      ],
    });

    console.log(`🧹 Deleted ${result.deletedCount} orders with invalid userId or productId.`);
  } catch (error) {
    console.error("❌ Error deleting invalid orders:", error);
  } finally {
    mongoose.disconnect();
  }
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});
