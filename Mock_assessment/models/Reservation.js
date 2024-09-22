const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  routeNumber: {
    type: Number,
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  dateOfJourney: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
