const BusRoute = require('../models/BusRoute');

// View All Routes
const viewRoutes = async (req, res) => {
  try {
    const routes = await BusRoute.find();
    if (routes.length === 0) {
      return res.status(404).json({ message: 'No routes found' });
    }

    const formattedRoutes = routes.map(route => ({
      routeNumber: route.routeNumber,
      from: route.from,
      to: route.to,
      fare: route.fare,
      availableSeats: route.seats
    }));

    return res.status(200).json(formattedRoutes);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  viewRoutes
};
