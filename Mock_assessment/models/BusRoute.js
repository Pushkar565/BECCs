const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  balance: { type: Number, default: 5000 },
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
});

const busRouteSchema = new mongoose.Schema({
  routeNumber: Number,
  from: String,
  to: String,
  fare: Number,
  seats: { type: [Number], default: Array.from({ length: 15 }, (_, i) => i + 1) }
});

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute' },
  seatNumber: Number,
  journeyDate: Date,
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
});

const User = mongoose.model('User', userSchema);
const BusRoute = mongoose.model('BusRoute', busRouteSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);
