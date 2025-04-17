import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { MdDelete, MdRestore } from 'react-icons/md';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5001';

const Trash = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  const fetchTrashedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Fetching trashed tasks with token:', token);
      
      const response = await axios.get('/api/tasks/trash', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Trash response:', response.data);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch tasks');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trashed tasks:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load trashed tasks');
      setLoading(false);
    }
  };

  const handleRestore = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.post(`/api/tasks/${taskId}/restore`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Task restored successfully');
        fetchTrashedTasks();
      } else {
        throw new Error(response.data.message || 'Failed to restore task');
      }
    } catch (error) {
      console.error('Error restoring task:', error);
      toast.error(error.response?.data?.message || 'Failed to restore task');
    }
  };

  const handleDeletePermanently = async (taskId) => {
    if (!window.confirm('Are you sure you want to permanently delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.delete(`/api/tasks/${taskId}/permanent`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        toast.success('Task permanently deleted');
        fetchTrashedTasks();
      } else {
        throw new Error(response.data.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task permanently:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task permanently');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trash</h1>
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>No tasks in trash</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Priority: {task.priority}</span>
                    <span>Status: {task.status}</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(task._id)}
                    className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors"
                    title="Restore task"
                  >
                    <MdRestore size={20} />
                  </button>
                  <button
                    onClick={() => handleDeletePermanently(task._id)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                    title="Delete permanently"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>
  );
};

export default Trash;