const Reservation = require('../models/Reservation');
const BusRoute = require('../models/BusRoute');
const User = require('../models/User');

// Book a Ticket
const bookTicket = async (req, res) => {
  try {
    const { username, routeNumber, seatNumber, dateOfJourney } = req.body;

    // Find the route
    const route = await BusRoute.findOne({ routeNumber });
    if (!route) return res.status(404).json({ message: 'Route not found' });

    // Check if seat is available
    if (!route.seats.includes(seatNumber)) {
      return res.status(400).json({ message: 'Seat not available' });
    }

    // Find the user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user has enough balance
    if (user.balance < route.fare) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct the fare from the user's balance
    user.balance -= route.fare;

    // Reserve the seat
    route.seats = route.seats.filter(seat => seat !== seatNumber);
    await route.save();

    // Create a new reservation
    const reservation = new Reservation({
      username,
      routeNumber,
      seatNumber,
      dateOfJourney
    });

    await reservation.save();
    await user.save();

    return res.status(200).json({
      message: `Hey ${username}, Reservation Confirmed!`,
      route: `${route.from} to ${route.to}`,
      dateOfJourney,
      seatNumber,
      availableBalance: user.balance
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// View All Reservations for a User
const viewReservations = async (req, res) => {
  try {
    const { username } = req.params;

    // Find all reservations for the user
    const reservations = await Reservation.find({ username });
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found' });
    }

    return res.status(200).json(reservations);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Modify Reservation
const modifyReservation = async (req, res) => {
  try {
    const { reservationId, newSeatNumber, newDateOfJourney } = req.body;

    // Find the reservation
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    // Check if modification is allowed (3 days before the journey)
    const journeyDate = new Date(reservation.dateOfJourney);
    const currentDate = new Date();
    if ((journeyDate - currentDate) / (1000 * 60 * 60 * 24) < 3) {
      return res.status(400).json({ message: 'Modification not allowed within 3 days of the journey' });
    }

    // Modify seat number or journey date
    if (newSeatNumber) reservation.seatNumber = newSeatNumber;
    if (newDateOfJourney) reservation.dateOfJourney = newDateOfJourney;

    await reservation.save();
    return res.status(200).json({
      message: `Reservation Modified!`,
      reservation
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Cancel Reservation
const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.body;

    // Find the reservation
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    // Check if cancellation is allowed (2 days before the journey)
    const journeyDate = new Date(reservation.dateOfJourney);
    const currentDate = new Date();
    if ((journeyDate - currentDate) / (1000 * 60 * 60 * 24) < 2) {
      return res.status(400).json({ message: 'Cancellation not allowed within 2 days of the journey' });
    }

    // Find the user and route
    const user = await User.findOne({ username: reservation.username });
    const route = await BusRoute.findOne({ routeNumber: reservation.routeNumber });

    // Refund 50% of the fare
    const refund = route.fare / 2;
    user.balance += refund;

    // Free up the seat
    route.seats.push(reservation.seatNumber);

    await user.save();
    await route.save();

    // Remove the reservation
    await Reservation.findByIdAndDelete(reservationId);

    return res.status(200).json({
      message: `Reservation Cancelled!`,
      refundAmount: refund,
      availableBalance: user.balance
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  bookTicket,
  viewReservations,
  modifyReservation,
  cancelReservation
};
