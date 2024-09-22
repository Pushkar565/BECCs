

const express = require('express');
const router = express.Router();
const { viewRoutes, bookTicket, viewReservations, checkBalance, modifyReservation, cancelReservation } = require('./controllers');

router.get('/routes', viewRoutes);
router.post('/book', bookTicket);
router.get('/reservations/:username', viewReservations);
router.get('/balance/:username', checkBalance);
router.put('/modify', modifyReservation);
router.post('/cancel', cancelReservation);

module.exports = router;
