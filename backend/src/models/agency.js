import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Agency name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'Agency slug is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  categories: {
    type: [String],
    required: [true, 'At least one category is required'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Agency must handle at least one category'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient category lookups
agencySchema.index({ categories: 1 });

const Agency = mongoose.model('Agency', agencySchema);

export default Agency;
