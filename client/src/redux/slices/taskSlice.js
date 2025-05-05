import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch tasks' });
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create task' });
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update task' });
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeader());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete task' });
    }
  }
);

export const addSubtask = createAsyncThunk(
  'tasks/addSubtask',
  async ({ taskId, subtaskData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks/${taskId}/subtasks`, subtaskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSubtaskStatus = createAsyncThunk(
  'tasks/updateSubtaskStatus',
  async ({ taskId, subtaskId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${taskId}/subtasks/${subtaskId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${id}/status`, { status }, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update task status' });
    }
  }
);

const initialState = {
  tasks: [],
  status: 'idle',
  error: null,
  selectedTask: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch tasks';
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        console.log('Task creation response:', action.payload);
        // Ensure the task is not marked as trashed
        const newTask = {
          ...action.payload.data,
          isTrashed: false
        };
        state.tasks.push(newTask);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        console.log('Task deletion response:', action.payload);
        // Remove the task from the list
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      // Add subtask
      .addCase(addSubtask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Update subtask status
      .addCase(updateSubtaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Update Task Status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload.data._id);
        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
      });
  },
});

export const { setSelectedTask, clearSelectedTask } = taskSlice.actions;

export default taskSlice.reducer; 