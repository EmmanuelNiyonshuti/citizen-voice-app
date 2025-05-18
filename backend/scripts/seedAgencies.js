import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Agency from '../src/models/agency.js';
import User from '../src/models/user.js';

// Load environment variables
dotenv.config();

const agencies = [
  {
    name: 'Rwanda Education Board (REB)',
    slug: 'reb',
    categories: ['EDUCATION']
  },
  {
    name: 'Rwanda Water Board (RWB)',
    slug: 'rwb',
    categories: ['WATER_SANITATION']
  },
  {
    name: 'Rwanda Revenue Authority (RRA)',
    slug: 'rra',
    categories: ['TAXES']
  },
  {
    name: 'Rwanda Social Security Board (RSSB)',
    slug: 'rssb',
    categories: ['HEALTHCARE']
  },
];

const seedAgencies = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create agencies and their admins
    for (const agencyData of agencies) {
      // Check if agency exists
      let agency = await Agency.findOne({ slug: agencyData.slug });
      
      if (!agency) {
        // Create new agency
        agency = await Agency.create(agencyData);
        console.log(`Created agency: ${agency.name}`);

        // Create agency admin
        const adminEmail = `admin@${agency.slug}.gov.rw`;
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
          const admin = new User({
            email: adminEmail,
            password: `${agency.slug}${process.env.ADMIN_PWD}`,
            role: 'agencyadmin',
            agency: agency._id,
            fullName: `${agency.name} Admin`
          });

          await admin.save();
          console.log(`Created admin for ${agency.name}: ${adminEmail}`);
        }
      } else {
        console.log(`Agency ${agency.name} already exists`);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding agencies:', error);
    process.exit(1);
  }
};

seedAgencies();
