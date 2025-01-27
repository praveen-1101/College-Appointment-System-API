// Routes for student-specific functionality
const express = require('express');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

const router = express.Router();

//Retrieves available time slots for a specific professor
router.get('/availability/:professorId', auth, async (req, res) => {
  try {
    const slots = await Availability.find({
      professorId: req.params.professorId,
      isBooked: false
    }).lean();
    
    res.json(slots || []);
  } catch (error) {
    res.status(400).json([]);
  }
});



//Books an appointment in an available time slot
router.post('/appointments', auth, async (req, res) => {
  try {
    const { availabilityId } = req.body;

    // Check if slot is available
    const availability = await Availability.findById(availabilityId);

    if (!availability || availability.isBooked) {
      return res.status(400).json({ error: 'Time slot is no longer available' });
    }

    // Check if student already booked this slot
    const existingAppointment = await Appointment.findOne({ 
      studentId: req.user.userId, 
      availabilityId 
    });
    
    if (existingAppointment) {
      return res.status(400).json({ error: 'You already booked this time slot' });
    }

    const appointment = new Appointment({
      studentId: req.user.userId,
      availabilityId
    });
    
    // Mark slot as booked and save both documents
    availability.isBooked = true;
    await availability.save();
    await appointment.save();
    
    res.json({ message: 'Appointment booked', data: appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Cancels an existing appointment
router.delete('/appointments/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Make the slot available again
    const availability = await Availability.findById(appointment.availabilityId);
    if (availability) {
      availability.isBooked = false;
      await availability.save();
    }
    
    await appointment.deleteOne();
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



//Retrieves all appointments for a specific student
router.get('/appointments/:studentId', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      studentId: req.params.studentId 
    })
    .populate('availabilityId')
    .lean();
    
    res.json(appointments || []);
  } catch (error) {
    res.status(400).json([]);
  }
});

module.exports = router;