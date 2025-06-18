//     Final Summary:
// ✅ Yes, you can combine multiple filters like keyword, category, brand, price.

// ❗ They are all AND-ed together by default.

// ✅ Only documents matching all conditions will be returned.

// 🔁 Use $or only when you want flexibility (like for keyword match).

// Let me know if you want a reusable filter-building function!




const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const {
      keyword = "",
      type = "",
      brands = [],
      priceRange = "",
      page = 1,
      limit = 12
    } = req.body;

    // 🔄 Handle brands: convert string or array into clean array
    let parsedBrands = [];
    if (brands) {
      if (typeof brands === 'string') {
        try {
          parsedBrands = JSON.parse(brands);
        } catch {
          parsedBrands = brands.includes(',')
            ? brands.split(',').map(b => b.trim())
            : [brands.trim()];
        }
      } else if (Array.isArray(brands)) {
        parsedBrands = brands.filter(b => b && b.trim());
      }
    }

    // 📦 Build MongoDB query
    const query = {};

    // 🔍 Smart keyword search across multiple fields
    if (keyword && keyword.trim()) {
      const trimmedKeyword = keyword.trim();
      const regEx = new RegExp(trimmedKeyword, 'i');
      const keywordNumber = Number(trimmedKeyword);
      const isNumeric = !isNaN(keywordNumber);

      query.$or = [
        { title: regEx },
        { description: regEx },
        { brand: regEx },
        { type: regEx },                      // ✅ Partial type match via regex
        ...(isNumeric ? [{ price: keywordNumber }] : [])
      ];
    }

    // ✅ Apply 'type' filter only if provided explicitly (from dropdown etc.)
    if (type && type.trim()) {
      query.type = type.trim();
    }

    // ✅ Apply brand filter
    if (parsedBrands.length > 0) {
      query.brand = { $in: parsedBrands };
    }

    // ✅ Apply price range
    if (priceRange && !isNaN(priceRange)) {
      query.price = { $lte: parseInt(priceRange) };
    }

    // 🧮 Pagination
    const skip = (page - 1) * limit;
    const parsedLimit = parseInt(limit);

    const products = await Product.find(query).skip(skip).limit(parsedLimit);
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / parsedLimit);

    console.log("Final MongoDB query:", JSON.stringify(query, null, 2));
    console.log(`Found ${totalProducts} products`);

    res.status(200).json({
      success: true,
      data: products,
      currentPage: parseInt(page),
      totalPages,
      totalProducts,
      appliedFilters: {
        keyword,
        type,
        brands: parsedBrands,
        priceRange,
        page,
        limit
      }
    });

  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getProducts };


// // when page is change the keep the filer as it and serch the product if the product are noto get shwo any thing 
// // when serch or the new category is chosed then remove aall the filer and add the new oens 
// // so in pagantion bsed on that the data will be send use the thunks for all this and cret ehte slcie to main all this together we will do this now man

// // src/redux/slices/filtersSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   keyword: "",
//   category: "",
//   priceRange: 10000, // max value
//   brands: []
// };

// const filtersSlice = createSlice({
//   name: "filters",
//   initialState,
//   reducers: {
//     setFilters: (state, action) => {
//       return { ...state, ...action.payload };
//     },
//     resetFilters: () => initialState
//   }
// });

// export const { setFilters, resetFilters } = filtersSlice.actions;
// export default filtersSlice.reducer;



// import { setProducts } from './productSlice'; // your main product slice
// import axios from 'axios';

// export const fetchFilteredProducts = () => async (dispatch, getState) => {
//   const filters = getState().productFilters;
//   try {
//     const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/products/filter`, filters);
//     dispatch(setProducts(res.data.data));
//   } catch (err) {
//     console.error("Filtering error", err);
//     dispatch(setProducts([]));
//   }
// };








// import { useDispatch } from 'react-redux';
// import { fetchFilteredProducts } from '../redux/filterProductsThunk';
// import { setFilters } from '../redux/productFilterSlice';

// const handleFilter = () => {
//   dispatch(setFilters({
//     keyword: searchTerm,
//     category: selectedCategory,
//     priceRange,
//     brands: selectedBrands,
//     color: selectedColor,
//     size: selectedSize,
//     rating: selectedRating,
//     page: 1,
//   }));
//   dispatch(fetchFilteredProducts());
// };




// import { configureStore } from "@reduxjs/toolkit";
// import filtersReducer from "./slices/filtersSlice";
// import productReducer from "./slices/productSlice";

// export const store = configureStore({
//   reducer: {
//     filters: filtersReducer,
//     products: productReducer
//   }
// });


// all the constion must match then only the product willc oem handle this man{
//   "keyword": "nikhil",
//   "category": "electronics",
//   "priceRange": 50,
//   "brands": ["Apple", "Samsung"]
// }


// 0 product is coem as the nikhil is not match


// ✅ Summary of What You Said:
// “When we use $or = [ { title: regEx }, { description: regEx }, { brand: regEx } ], then this array of objects is used as a query. No matter how large the text is, if the keyword is present in that field (title/description/brand), then that document will be returned by .find().”

// ✅ Yes! That is 100% correct.


// Yes, absolutely! ✅ You can add multiple fields to the query object in MongoDB/Mongoose — that’s exactly how complex filters are built.

// 🔍 Let’s break this down step-by-step:
// js
// Copy
// Edit
// if (parsedBrands && parsedBrands.length > 0) {
//   query.brand = { $in: parsedBrands };
// }
// ✅ This adds a condition:
// → brand must be in the given list (like: ["Nike", "Adidas"]).

// js
// Copy
// Edit
// if (priceRange && priceRange.toString().trim() && !isNaN(priceRange)) {
//   query.price = { $lte: parseInt(priceRange) };
// }
// ✅ This adds another condition:
// → price must be less than or equal to the given range.