import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    // Create new admin
    const admin = new User({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PWD,
      role: 'admin',
      fullName: 'Admin User'
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();