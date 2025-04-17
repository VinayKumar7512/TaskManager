import bcrypt from 'bcryptjs';

const manualCompare = async () => {
  try {
    const plainTextPassword = '1234567';
    const hashedPassword = '$2b$10$QwmZy9Q1xm6439mnjDOIIe1nnqx8PEpYrt7iFfc.7ZmTtyybSkqUG';

    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    console.log('Password comparison result:', isMatch);
  } catch (error) {
    console.error('Error during manual comparison:', error);
  }
};

manualCompare();