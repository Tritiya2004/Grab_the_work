const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  skills_required: {
    type: [String], // Array of strings
    required: true
  },
  payment_type: {
    type: String,
    required: true,
    enum: ['hourly', 'fixed'] // Only allow "hourly" or "fixed"
  },
  hourly_rate: {
    type: Number,
    required: function() {
      return this.payment_type === 'hourly';
    }
  },
  total_hours: {
    type: Number,
    required: function() {
      return this.payment_type === 'hourly';
    }
  },
  total_days: {
    type: Number,
    required: function() {
      return this.payment_type === 'fixed';
    }
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
