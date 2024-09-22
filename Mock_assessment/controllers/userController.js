const User = require('../models/User');

// Check Balance
const checkBalance = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      message: `Hey ${username}, Your Available Balance: Rs. ${user.balance}`
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  checkBalance,
  getAllUsers
};
