import { response } from "express";
import User from "../models/user.js";
import { createJWT } from "../utils/index.js";
import Notice from "../models/notification.js";
import Task from "../models/task.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role, title } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role,
      title,
    });

    if (user) {
      isAdmin ? createJWT(res, user._id) : null;

      user.password = undefined;

      res.status(201).json(user);
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email received in request:", email);

    const user = await User.findOne({ email }).select('+password');

    console.log("User found in database:", user ? "Yes" : "No");

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    if (!user?.isActive) {
      return res.status(401).json({
        status: false,
        message: "User account has been deactivated, contact the administrator",
      });
    }

    const isMatch = await user.matchPassword(password);
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

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      htttpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select("name title role email isActive");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date (start of day)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find tasks due today
    const tasksDueToday = await Task.find({
      user: userId,
      dueDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $ne: 'completed' },
      isTrashed: false
    }).select('title dueDate priority');
    
    // Create notifications for tasks due today
    const dueTodayNotifications = tasksDueToday.map(task => ({
      user: userId,
      message: `Task "${task.title}" is due today!`,
      read: false,
      task: task._id,
      notiType: 'dueToday',
      createdAt: new Date()
    }));
    
    // Get existing notifications
    const existingNotifications = await Notice.find({
      user: userId,
      read: false
    }).populate("task", "title");
    
    // Combine existing notifications with due today notifications
    const allNotifications = [...existingNotifications, ...dueTodayNotifications];
    
    res.status(200).json(allNotifications);
  } catch (error) {
    console.error('Error in getNotificationsList:', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id =
      isAdmin && userId === _id
        ? userId
        : isAdmin && userId !== _id
        ? _id
        : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: "Profile Updated Successfully.",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { user: userId, read: false },
        { read: true },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, user: userId, read: false },
        { read: true },
        { new: true }
      );
    }

    res.status(200).json({ status: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: `Password chnaged successfully.`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive; //!user.isActive

      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${
          user?.isActive ? "activated" : "disabled"
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const { userId } = req.user;
    const { settings } = req.body;

    console.log('Updating settings for user:', userId);
    console.log('New settings:', settings);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    // Update user settings
    user.settings = {
      ...user.settings,
      ...settings
    };
    
    await user.save();

    res.status(200).json({
      status: true,
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({
      status: false,
      message: 'Server error while updating settings'
    });
  }
};

export const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select('settings');

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: true,
      settings: user.settings || {}
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    return res.status(500).json({
      status: false,
      message: 'Server error while getting settings'
    });
  }
};