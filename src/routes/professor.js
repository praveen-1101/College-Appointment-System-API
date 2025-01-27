// Routes for professor-specific functionality
const express = require('express');
const User = require('../models/User');
const Availability = require('../models/Availability');
const auth = require('../middleware/auth');

const router = express.Router();


//Allows professors to set their availability slots
router.post('/', auth, async (req, res) => {
  try {
    const { startTime, endTime } = req.body;


    // Check if user is a professor
    const user = await User.findById(req.user.userId);

    if (!user || user.role !== 'professor') {
      return res.status(403).json({ error: 'Only professors can set availability' });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Create new availability slot
    const availability = new Availability({
      professorId: user._id,
      startTime,
      endTime
    });
    
    await availability.save();
    res.json({ message: 'Availability set', data: availability });
  } 
  catch (error) 
  {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;