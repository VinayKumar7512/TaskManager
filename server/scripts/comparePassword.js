import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const comparePassword = async () => {
  try {
    // Connect to the database
    await mongoose.connect('mongodb+srv://bathulavinaykumar75:dbvinaykumar@cluster0.wp5kt.mongodb.net/TaskManagerDB?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to the database');

    // Find the user by email
    const email = 'bathulavinaykumar45@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Compare the password
    const isMatch = await bcrypt.compare('1234567', user.password);
    console.log('Password comparison result:', isMatch);
  } catch (error) {
    console.error('Error comparing password:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from the database');
  }
};

comparePassword();