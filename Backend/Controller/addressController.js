import mongoose from 'mongoose';
import Address from '../Model/addressModel.js';

// GET addresses by user Id
export const getAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addresses = await Address.find({ userId });
    if (addresses.length === 0) {
      return res.status(404).json({ message: 'No addresses found for this user.' });
    }
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST a new address for a user
export const createAddress = async (req, res) => {
  const { house, area, landmark } = req.body;
  const { userId } = req.params;

  if (!house || !area || !landmark) {
    return res.status(400).json({ success: false, message: 'All address fields are required' });
  }

  try {
    // Check for duplicate address for the same user
    const duplicate = await Address.findOne({
      userId,
      house: house.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
    });

    if (duplicate) {
      // If duplicate exists, just return current addresses without adding or sending duplicate message
      const savedAddresses = await Address.find({ userId });
      return res.status(200).json({
        success: true,
        message: 'Address already exists',
        savedAddresses,
      });
    }

    const newAddress = new Address({
      userId,
      house: house.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
    });

    await newAddress.save();

    const savedAddresses = await Address.find({ userId });

    res.status(201).json({
      success: true,
      message: 'Address saved successfully',
      savedAddresses,
    });
  } catch (err) {
    console.error('Error creating address:', err);
    res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

// DELETE an address by ID
export const deleteAddress = async (req, res) => {
  try {
    await Address.deleteOne({ _id: req.params.addressId, userId: req.params.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

