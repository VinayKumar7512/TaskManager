import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TaskForm from '../components/tasks/TaskForm';
import { toast } from 'react-toastify';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await fetch(`http://localhost:5001/api/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || 'Failed to fetch task');
        }
        
        const data = await response.json();
        setTask(data.data);
      } catch (err) {
        console.error('Fetch task error:', err);
        setError(err.message);
        toast.error(err.message);
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [id, user, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading task...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Task not found.</p>
      </div>
    );
  }
  
  return (
    <div className="h-full py-4">
      <div className="w-full h-full flex flex-col gap-6 2xl:gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Edit Task</h1>
          <TaskForm task={task} isEdit={true} />
        </div>
      </div>
    </div>
  );
};

export default EditTask; 