import mongoose from 'mongoose';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const updatePasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // Update each user's password to a default value
    for (const user of users) {
      // Set a default password for all users
      user.password = '1234567';
      await user.save();
      console.log(`Updated password for user: ${user.email}`);
    }

    console.log('All passwords updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
};

updatePasswords(); 