import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import mongoose from "mongoose";

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    console.log('Creating new task with data:', req.body);
    
    // Ensure isTrashed is false for new tasks
    const taskData = {
      ...req.body,
      user: req.user._id || req.user.userId,
      isTrashed: false
    };

    console.log('Task data before creation:', taskData);
    
    const task = await Task.create(taskData);
    console.log('Created task:', task);

    // Check if task is due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const taskDueDate = new Date(task.dueDate);
    taskDueDate.setHours(0, 0, 0, 0);
    
    console.log('Task due date:', taskDueDate);
    console.log('Today:', today);
    console.log('Tomorrow:', tomorrow);
    
    if (taskDueDate.getTime() === today.getTime()) {
      console.log('Task is due today, creating notification');
      // Create notification for task due today
      await Notice.create({
        user: req.user._id || req.user.userId,
        message: `Task "${task.title}" is due today!`,
        read: false,
        task: task._id,
        notiType: 'dueToday',
        createdAt: new Date()
      });
    }

    res.status(201).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      ...task,
      title: task.title + " - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    //alert users of the task
    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTaskks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { status, priority, limit = 10, page = 1 } = req.query;
    const query = { user: req.user._id };

    // Add status filter if provided and not 'all'
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add priority filter if provided
    if (priority) {
      query.priority = priority;
    }

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    // Get tasks with pagination
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      total,
      data: tasks
    });
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;

    const { id } = req.params;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// @desc    Get trashed tasks
// @route   GET /api/tasks/trash
// @access  Private
export const getTrashedTasks = async (req, res) => {
  try {
    console.log('Getting trashed tasks for user:', req.user._id);
    
    const tasks = await Task.find({ 
      user: req.user._id,
      isTrashed: true 
    }).sort({ updatedAt: -1 });
    
    console.log('Found trashed tasks:', tasks.length);

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error("Get trashed tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trashed tasks",
      error: error.message
    });
  }
};

// @desc    Restore task from trash
// @route   POST /api/tasks/:id/restore
// @access  Private
export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user._id,
      isTrashed: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found in trash"
      });
    }

    await task.restore();

    res.status(200).json({
      success: true,
      message: "Task restored successfully",
      data: task
    });
  } catch (error) {
    console.error("Restore task error:", error);
    res.status(500).json({
      success: false,
      message: "Error restoring task",
      error: error.message
    });
  }
};

// @desc    Permanently delete task
// @route   DELETE /api/tasks/:id/permanent
// @access  Private
export const deleteTaskPermanently = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user._id,
      isTrashed: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found in trash"
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task permanently deleted",
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error("Delete task permanently error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting task permanently",
      error: error.message
    });
  }
};

// @desc    Delete task (move to trash)
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    console.log('Moving task to trash:', req.params.id);
    
    const task = await Task.findOne({ 
      _id: req.params.id,
      user: req.user._id,
      isTrashed: false
    });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found" 
      });
    }

    // Soft delete the task
    task.isTrashed = true;
    await task.save();
    console.log('Task moved to trash:', task);

    res.status(200).json({ 
      success: true,
      message: "Task moved to trash successfully",
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error moving task to trash", 
      error: error.message 
    });
  }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private
export const addSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.subtasks.push(req.body);
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update subtask status
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @access  Private
export const updateSubtaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }
    
    subtask.completed = req.body.completed;
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
  try {
    // Handle both cases where user ID might be in different properties
    const userId = req.user._id || req.user.userId;
    
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID not found in request'
      });
    }
    
    // Convert string ID to ObjectId if needed
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    
    const stats = await Task.aggregate([
      { 
        $match: { 
          user: userObjectId,
          isTrashed: { $ne: true }  // Exclude trashed tasks
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          todo: {
            $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          }
        }
      }
    ]);

    // If no tasks exist, return default values
    const defaultStats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0
    };

    res.status(200).json({
      status: 'success',
      data: stats[0] || defaultStats
    });
  } catch (error) {
    console.error('Error in getTaskStats:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};