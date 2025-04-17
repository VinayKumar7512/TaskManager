import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const hashPasswordAndUpdate = async () => {
  try {
    // Connect to the database
    await mongoose.connect('mongodb+srv://bathulavinaykumar75:dbvinaykumar@cluster0.wp5kt.mongodb.net/TaskManagerDB?retryWrites=true&w=majority&appName=Cluster0');

    console.log('Connected to the database');

    // Find the user by email
    const email = 'bathulavinaykumar45@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Hash the plain text password
    const hashedPassword = await bcrypt.hash('1234567', 10);
    console.log('Hashed Password:', hashedPassword);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from the database');
  }
};

hashPasswordAndUpdate();