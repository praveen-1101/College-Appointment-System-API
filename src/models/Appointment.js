// Schema definition for student appointments
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Reference to the student who booked the appointment
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Reference to the availability slot that was booked
  availabilityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Availability', 
    required: true 
  },
  // When the appointment was booked
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);