const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// 獲取所有店家
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 創建新店家
router.post('/', async (req, res) => {
  const store = new Store({
    name: req.body.name,
    address: req.body.address,
    location: {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
    },
    description: req.body.description,
    category: req.body.category,
    rating: req.body.rating,
  });

  try {
    const newStore = await store.save();
    res.status(201).json(newStore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 獲取附近的店家
router.get('/nearby', async (req, res) => {
  const { longitude, latitude, maxDistance = 5000 } = req.query;

  try {
    const stores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 