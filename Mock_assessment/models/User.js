const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 5000, // Default starting balance
  },
  reservations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
  ],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
