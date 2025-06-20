const express = require('express');
const router = express.Router();
const { auth,isAdmin } =require("../middlewares/auth");
const User=require("../models/UserData");// Your auth middleware

// handle the adress


// GET - Fetch all addresses for logged-in user
router.get('/', auth, async (req, res) => {
  try {
// console.log("The user address", req.user.id);

    const user = await User.findById(req.user.id).select('addresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
console.log(user.addresses);

    res.json({ addresses: user.addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Add new address
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, addressType } = req.body;

    // Validation
    if (!name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAddress = {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      addressType: addressType || 'Home'
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ 
      message: 'Address added successfully',
      address: user.addresses[user.addresses.length - 1]
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update address
router.put('/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { name, phone, address, city, state, pincode, addressType } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Update address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex]._doc,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      addressType: addressType || 'Home'
    };

    await user.save();

    res.json({ 
      message: 'Address updated successfully',
      address: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete address
router.delete('/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;