const mongoose = require('mongoose');

const ShortlistedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    lowercase: true,
    
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicants',
    required: true
  },

  interviewTime: {
    type: Date,
    required: [true, 'Please schedule an interview time']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shortlisted', ShortlistedSchema);