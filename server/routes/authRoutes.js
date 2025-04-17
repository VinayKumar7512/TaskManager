import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user.js';
import { login, register, checkEmail } from "../controllers/authController.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/check-email
// @desc    Check if an email exists
// @access  Public
router.post('/check-email', checkEmail);

// @route   POST /api/auth/test-password
// @desc    Test password comparison
// @access  Public
router.post('/test-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Test password - Email:", email);
    console.log("Test password - Password:", password);

    const user = await User.findOne({ email }).select('+password');
    console.log("Test password - User found:", user ? "Yes" : "No");
    if (user) {
      console.log("Test password - User password hash:", user.password);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    console.log("Test password - Password comparison result:", isMatch);

    res.status(200).json({ 
      isMatch,
      passwordHash: user.password
    });
  } catch (error) {
    console.error("Test password error:", error);
    res.status(500).json({ message: "Error testing password", error: error.message });
  }
});

export default router; 