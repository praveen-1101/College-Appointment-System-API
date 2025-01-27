// Schema definition for professor availability slots
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  // Reference to the professor's user ID
  professorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Start time of the availability slot
  startTime: { 
    type: Date, 
    required: true 
  },
  // End time of the availability slot
  endTime: { 
    type: Date, 
    required: true 
  },
  // Whether this slot has been booked
  isBooked: { 
    type: Boolean, 
    default: false 
  },
   // When this availability slot was created
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Availability', availabilitySchema);