const mongoose = require('mongoose');

// Define the Bid schema
const BidSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project', // Reference to the Project collection
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // Reference to the User collection
      required: true,
    },
   
    bidAmount: {
      type: Number,
      required: true,
      min: 0, // Ensure bid amount is non-negative
    },
    bidMessage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500, // Limit message length
    },
    bidDate: {
      type: Date,
      default: Date.now, // Automatically set to the current date
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending', // Default status is pending
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Bid model
const Bid = mongoose.model('Bid', BidSchema);

module.exports = Bid;
