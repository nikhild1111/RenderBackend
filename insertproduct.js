// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const mongoose = require('mongoose');
// const Product = require('./models/Product');

// // Ensure upload folder exists
// const UPLOAD_DIR = path.join(__dirname, 'public/uploads');
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// // Allowed categories
// const allowedCategories = [
//   'smartphones', 'electronics', 'jewelery', 'men-clothing',
//   'women-clothing', 'food', 'beauty', 'kids-clothing', 'footwear'
// ];

// async function downloadImage(url, filepath) {
//   const response = await axios({ url, method: 'GET', responseType: 'stream' });
//   return new Promise((resolve, reject) => {
//     const writer = fs.createWriteStream(filepath);
//     response.data.pipe(writer);
//     writer.on('finish', resolve);
//     writer.on('error', reject);
//   });
// }

// async function main() {
//   try {
//     await mongoose.connect('mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('✅ Connected to MongoDB');

//     // Clear existing data if needed
//     // await Product.deleteMany({});
//     const { data } = await axios.get('https://dummyjson.com/products?limit=0');
//     const products = data.products;
//     console.log(`📦 Total products fetched: ${products.length}`);

//     for (let i = 0; i < products.length; i++) {
//       const item = products[i];

//       // Check if the category is allowed
//       const category = item.category?.toLowerCase().replace(/\s/g, '-');
//       if (!allowedCategories.includes(category)) {
//         console.warn(`⚠️ Skipping ${item.title} due to unmatched category: ${item.category}`);
//         continue;
//       }

//       const imgUrl = item.thumbnail || item.images?.[0];
//       if (!imgUrl) {
//         console.warn(`⚠️ Skipping ${item.title}: no image`);
//         continue;
//       }

//       const extension = path.extname(imgUrl).split('?')[0] || '.jpg';
//       const filename = `product-${item.id}${extension}`;
//       const filePath = path.join(UPLOAD_DIR, filename);

//       try {
//         await downloadImage(imgUrl, filePath);
//         console.log(`🖼️ Downloaded: ${item.title}`);
//       } catch (err) {
//         console.error(`❌ Failed image for ${item.title}: ${err.message}`);
//         continue;
//       }

//       const productDoc = new Product({
//         title: item.title.toLowerCase(),
//         description: item.description,
//         price: Math.floor(item.price),
//         quantity: Math.floor(Math.random() * 100) + 1,
//         image: `/uploads/${filename}`,
//         type: category,
//         brand: item.brand || 'Generic'
//       });

//       try {
//         await productDoc.save();
//         console.log(`✅ Inserted: ${item.title}`);
//       } catch (err) {
//         console.error(`❌ Insert failed for ${item.title}: ${err.message}`);
//       }
//     }

//     console.log('🎉 Seeding completed successfully!');
//   } catch (err) {
//     console.error('❌ Error:', err.message);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// main();




// // dummy json script
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const mongoose = require('mongoose');
// const Product = require('./models/Product');

// // Ensure upload folder exists
// const UPLOAD_DIR = path.join(__dirname, 'public/uploads');
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// // Category mapping to your ORIGINAL categories - keeping your existing schema!
// const categoryMapping = {
//   'beauty': 'beauty',
//   'fragrances': 'beauty',
//   'furniture': 'electronics', // or create new category if needed
//   'groceries': 'food',
//   'home-decoration': 'beauty', // or keep as general
//   'kitchen-accessories': 'electronics',
//   'laptops': 'electronics',
//   'mens-shirts': 'men-clothing',
//   'mens-shoes': 'footwear',
//   'mens-watches': 'jewelery', // using your existing jewelery category
//   'mobile-accessories': 'electronics',
//   'motorcycle': 'electronics', // or keep as general
//   'smartphones': 'smartphones', // your original category
//   'skin-care': 'beauty',
//   'sports-accessories': 'electronics',
//   'sunglasses': 'jewelery', // accessories go to jewelery
//   'tablets': 'electronics',
//   'tops': 'women-clothing',
//   'vehicle': 'electronics',
//   'womens-bags': 'women-clothing',
//   'womens-dresses': 'women-clothing',
//   'womens-jewellery': 'jewelery', // your original category
//   'womens-shoes': 'footwear',
//   'womens-watches': 'jewelery'
// };

// // Your ORIGINAL allowed categories (keeping your existing structure)
// const originalCategories = [
//   'smartphones', 'electronics', 'jewelery', 'men-clothing',
//   'women-clothing', 'food', 'beauty', 'kids-clothing', 'footwear'
// ];

// async function downloadImage(url, filepath) {
//   try {
//     const response = await axios({ 
//       url, 
//       method: 'GET', 
//       responseType: 'stream',
//       timeout: 10000 // 10 seconds timeout
//     });
    
//     return new Promise((resolve, reject) => {
//       const writer = fs.createWriteStream(filepath);
//       response.data.pipe(writer);
//       writer.on('finish', resolve);
//       writer.on('error', reject);
//     });
//   } catch (error) {
//     throw new Error(`Download failed: ${error.message}`);
//   }
// }

// function normalizeCategory(category) {
//   if (!category) return 'general';
  
//   const normalized = category.toLowerCase().replace(/\s+/g, '-');
//   return categoryMapping[normalized] || 'general';
// }

// async function main() {
//   try {
//     await mongoose.connect('mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('✅ Connected to MongoDB');

//     // Uncomment the line below if you want to clear existing data
//     // await Product.deleteMany({});
//     // console.log('🧹 Cleared existing products');

//     const { data } = await axios.get('https://dummyjson.com/products?limit=0');
//     const products = data.products;
//     console.log(`📦 Total products fetched: ${products.length}`);

//     let successCount = 0;
//     let failureCount = 0;

//     for (let i = 0; i < products.length; i++) {
//       const item = products[i];
      
//       console.log(`\n🔄 Processing ${i + 1}/${products.length}: ${item.title}`);

//       // Normalize category - no more skipping!
//       const normalizedCategory = normalizeCategory(item.category);
      
//       const imgUrl = item.thumbnail || item.images?.[0];
//       let imagePath = null;

//       // Try to download image, but don't skip product if it fails
//       if (imgUrl) {
//         try {
//           const extension = path.extname(imgUrl).split('?')[0] || '.jpg';
//           const filename = `product-${item.id}${extension}`;
//           const filePath = path.join(UPLOAD_DIR, filename);
          
//           await downloadImage(imgUrl, filePath);
//           imagePath = `/uploads/${filename}`;
//           console.log(`🖼️ Downloaded image: ${filename}`);
//         } catch (err) {
//           console.warn(`⚠️ Image download failed for ${item.title}: ${err.message}`);
//           // Continue without image
//         }
//       }

//       // Create product document using YOUR ORIGINAL SCHEMA
//       const productDoc = new Product({
//         title: item.title.toLowerCase(), // keeping your original format
//         description: item.description || 'No description available',
//         price: Math.floor(item.price || 0),
//         quantity: item.stock || Math.floor(Math.random() * 100) + 1,
//         image: imagePath || '/uploads/default-product.jpg',
//         type: normalizedCategory, // mapped to your original categories
//         brand: item.brand || 'Generic'
//         // Only using fields that exist in your original Product model
//       });

//       try {
//         await productDoc.save();
//         console.log(`✅ Inserted: ${item.title} (Category: ${normalizedCategory})`);
//         successCount++;
//       } catch (err) {
//         console.error(`❌ Insert failed for ${item.title}: ${err.message}`);
//         failureCount++;
//       }
//     }

//     console.log('\n🎉 Seeding completed!');
//     console.log(`📊 Summary: ${successCount} successful, ${failureCount} failed`);
    
//   } catch (err) {
//     console.error('❌ Error:', err.message);
//   } finally {
//     await mongoose.connection.close();
//     console.log('🔐 Database connection closed');
//   }
// }

// main();



// fakestore api
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Ensure upload folder exists
const UPLOAD_DIR = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Fake Store API category mapping to YOUR original categories
const fakeStoreCategoryMapping = {
  "men's clothing": 'men-clothing',
  "women's clothing": 'women-clothing',
  "jewelery": 'jewelery',
  "electronics": 'electronics'
};

async function downloadImage(url, filepath) {
  try {
    const response = await axios({ 
      url, 
      method: 'GET', 
      responseType: 'stream',
      timeout: 10000
    });
    
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
}

function normalizeFakeStoreCategory(category) {
  if (!category) return 'electronics';
  return fakeStoreCategoryMapping[category.toLowerCase()] || 'electronics';
}

async function main() {
  try {
    await mongoose.connect('mongodb+srv://NikhilDomade:1234Nikhil@cluster0.saebgtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    console.log('🛍️ Fetching products from Fake Store API...');
    const { data: fakeStoreProducts } = await axios.get('https://fakestoreapi.com/products');
    console.log(`📦 Fake Store products fetched: ${fakeStoreProducts.length}`);

    let successCount = 0;
    let failureCount = 0;
    let currentId = 195; // Starting from 195 to avoid conflict with DummyJSON

    console.log('\n🔄 Processing Fake Store products (Starting from ID 195)...\n');

    for (let i = 0; i < fakeStoreProducts.length; i++) {
      const item = fakeStoreProducts[i];
      
      console.log(`🔄 Processing ${i + 1}/${fakeStoreProducts.length}: ${item.title}`);
      console.log(`📋 Original Category: ${item.category}`);

      // Map category to your original schema
      const normalizedCategory = normalizeFakeStoreCategory(item.category);
      console.log(`🎯 Mapped Category: ${normalizedCategory}`);
      
      let imagePath = null;

      // Download image
      if (item.image) {
        try {
          const extension = '.jpg'; // Fake Store images are usually jpg
          const filename = `fakestore-${currentId}${extension}`;
          const filePath = path.join(UPLOAD_DIR, filename);
          
          await downloadImage(item.image, filePath);
          imagePath = `/uploads/${filename}`;
          console.log(`🖼️ Downloaded image: ${filename}`);
        } catch (err) {
          console.warn(`⚠️ Image download failed for ${item.title}: ${err.message}`);
          // Continue without image
        }
      }

      // Create product using YOUR original schema
      const productDoc = new Product({
        title: item.title.toLowerCase(), // keeping your original format
        description: item.description || 'No description available',
        price: Math.floor(item.price || 0),
        quantity: Math.floor(Math.random() * 100) + 1, // random quantity since Fake Store doesn't provide it
        image: imagePath || '/uploads/default-product.jpg',
        type: normalizedCategory,
        brand: 'Generic' // Fake Store doesn't provide brand info
      });

      try {
        await productDoc.save();
        console.log(`✅ Inserted: ${item.title}`);
        console.log(`📊 Database ID: ${currentId} | Category: ${normalizedCategory}`);
        console.log(`💰 Price: $${Math.floor(item.price)}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Insert failed for ${item.title}: ${err.message}`);
        failureCount++;
      }

      currentId++;
      console.log('-'.repeat(60));
    }

    console.log('\n🎉 Fake Store API Seeding Completed!');
    console.log('='.repeat(50));
    console.log(`📊 Total Products Added: ${successCount}`);
    console.log(`❌ Failed Insertions: ${failureCount}`);
    console.log(`🆔 ID Range: 195 - ${currentId - 1}`);
    console.log('='.repeat(50));
    
    // Show category breakdown
    console.log('\n📋 Category Breakdown:');
    const categoryCount = {};
    fakeStoreProducts.forEach(item => {
      const cat = normalizeFakeStoreCategory(item.category);
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
  }
}

main();