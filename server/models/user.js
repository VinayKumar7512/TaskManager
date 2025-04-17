import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  role: {
    type: String,
    required: [true, 'Please provide your role'],
    trim: true,
    maxlength: [50, 'Role cannot be more than 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      taskReminders: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false }
    },
    display: {
      darkMode: { type: Boolean, default: false },
      compactView: { type: Boolean, default: false },
      showCompletedTasks: { type: Boolean, default: true }
    },
    taskDefaults: {
      defaultPriority: { type: String, default: 'medium', enum: ['low', 'medium', 'high'] },
      defaultStatus: { type: String, default: 'todo', enum: ['todo', 'in-progress', 'completed'] },
      defaultDueDate: { type: String, default: '7', enum: ['1', '3', '7', '14', '30'] }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     next();
//   }

//   try {
//     console.log("Hashing password:", this.password);
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     console.log("Password hashed successfully");
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     next(error);
//   }
// });

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Compare user entered password to stored password in database
userSchema.methods.comparePassword = async function(enteredPassword) {
  try {
    console.log("Comparing passwords:");
    console.log("Entered password:", enteredPassword);
    console.log("Stored password:", this.password);
    // Direct comparison instead of using bcrypt
    const isMatch = enteredPassword === this.password;
    console.log("Password comparison result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

export default User;