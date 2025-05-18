import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['SUGGESTION', 'APPRECIATION', 'OTHER'],
    default: 'OTHER'
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['HEALTHCARE', 'ROADS', 'SANITATION', 'EDUCATION', 'GOVERNMENT_STAFF', 'OTHER'],
    default: 'OTHER'
  },
  message: {
    type: String,
    required: [true, 'Feedback message is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback; 