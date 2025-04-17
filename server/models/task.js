import mongoose from 'mongoose';
import AppError from "../utils/AppError.js";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'todo'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ["work", "personal", "shopping", "health", "other"],
    default: "other",
  },
  tags: [{
    type: String,
    trim: true,
  }],
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  isTrashed: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index for faster queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ dueDate: 1 });

// Virtual for task completion status
taskSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});

// Virtual for checking if task is overdue
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.status === "completed") return false;
  return new Date() > this.dueDate;
});

// Method to mark task as completed
taskSchema.methods.markAsCompleted = function () {
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

// Method to mark task as in progress
taskSchema.methods.markAsInProgress = function () {
  this.status = "in-progress";
  this.completedAt = null;
  return this.save();
};

// Method to reset task to todo
taskSchema.methods.resetToTodo = function () {
  this.status = "todo";
  this.completedAt = null;
  return this.save();
};

// Method to update task status
taskSchema.methods.updateStatus = async function (newStatus) {
  if (!["todo", "in-progress", "completed"].includes(newStatus)) {
    throw new AppError("Invalid status", 400);
  }

  this.status = newStatus;
  
  if (newStatus === "completed") {
    this.completedAt = new Date();
  } else {
    this.completedAt = undefined;
  }

  return this.save();
};

// Static method to get task statistics
taskSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: userId } },
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

  return stats[0] || {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  };
};

// Pre-save middleware to set completedAt
taskSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "completed") {
    this.completedAt = new Date();
  } else if (this.isModified("status") && this.status !== "completed") {
    this.completedAt = undefined;
  }
  next();
});

// Add a pre-find middleware to handle soft deletes
taskSchema.pre('find', function() {
  // Only filter out trashed tasks if we're not explicitly querying for them
  if (!this.getQuery().isTrashed) {
    this.where({ isTrashed: { $ne: true } });
  }
});

taskSchema.pre('findOne', function() {
  // Only filter out trashed tasks if we're not explicitly querying for them
  if (!this.getQuery().isTrashed) {
    this.where({ isTrashed: { $ne: true } });
  }
});

// Method to soft delete a task
taskSchema.methods.softDelete = async function() {
  this.isTrashed = true;
  return this.save();
};

// Method to restore a task from trash
taskSchema.methods.restore = async function() {
  this.isTrashed = false;
  return this.save();
};

const Task = mongoose.model('Task', taskSchema);

export default Task;