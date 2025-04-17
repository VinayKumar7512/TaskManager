import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in cookies (for web app)
    if (req.cookies?.token) {
      token = req.cookies.token;
    } 
    // Check for token in Authorization header (for API requests)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decodedToken);

      const user = await User.findById(decodedToken.userId || decodedToken.id).select(
        "isAdmin email name"
      );
      
      if (!user) {
        return res.status(401).json({ 
          status: false, 
          message: "User not found" 
        });
      }

      // Set both _id and userId for consistency
      req.user = {
        _id: user._id,
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };