import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const responseSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  respondedAt: {
    type: Date,
    default: Date.now
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responderRole: {
    type: String,
    enum: ['admin', 'agencyadmin'],
    required: true
  },
  responderAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency'
  }
}, { _id: true });

const complaintSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    default: () => nanoid(10).toUpperCase()
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'EDUCATION',
      'TAXES',
      'SECURITY',
      'CORRUPTION',
      'HEALTHCARE',
      'INFRASTRUCTURE',
      'WATER_SANITATION',
      'PUBLIC_TRANSPORT',
      'OTHER'
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED'],
    default: 'PENDING'
  },
  responses: [responseSchema],
  assignedAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
complaintSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance
complaintSchema.index({ ticketId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ assignedAgency: 1 });

export default mongoose.model('Complaint', complaintSchema); 