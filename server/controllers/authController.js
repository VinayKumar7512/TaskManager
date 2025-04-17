import User from '../models/user.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email received in request:", email);
    console.log("Password received in request:", password);

    // Explicitly select the password field
    const user = await User.findOne({ email }).select('+password');

    console.log("User found in database:", user ? "Yes" : "No");
    if (user) {
      console.log("User password:", user.password);
    }

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    // Only check isActive if it exists and is explicitly false
    if (user.isActive === false) {
      return res.status(401).json({
        status: false,
        message: "User account has been deactivated, contact the administrator",
      });
    }

    // Use the new comparePassword method
    const isMatch = await user.comparePassword(password);
    console.log("Password comparison result:", isMatch);

    if (user && isMatch) {
      const token = user.getSignedJwtToken();
      user.password = undefined;

      res.status(200).json({
        status: true,
        user,
        token
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ 
      status: false, 
      message: "Server error during login",
      error: error.message 
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, title } = req.body;

    console.log("Registration - Email:", email);
    console.log("Registration - Password:", password);

    // Check if user exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    // Create user with plain text password
    const user = await User.create({
      name,
      email,
      password, // Store password in plain text
      role,
      title,
      isActive: true
    });

    console.log("User created successfully:", user ? "Yes" : "No");
    if (user) {
      console.log("Stored password:", user.password);
    }

    if (user) {
      const token = user.getSignedJwtToken();
      user.password = undefined;

      res.status(201).json({
        status: true,
        user,
        token
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Registration error:", error);
    return res.status(500).json({ 
      status: false, 
      message: "Server error during registration",
      error: error.message 
    });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Check if email exists in database
    const user = await User.findOne({ email });
    
    return res.status(200).json({ 
      exists: !!user,
      message: user ? "Email exists" : "Email not found"
    });
  } catch (error) {
    console.error("Check email error:", error);
    return res.status(500).json({ message: "Server error while checking email" });
  }
}; 