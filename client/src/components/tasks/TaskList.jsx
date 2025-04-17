import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdEdit, MdDelete, MdCheckCircle, MdCancel } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import { deleteTask } from '../../redux/slices/taskSlice';

const TaskList = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:5001/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data.data || []);
    } catch (err) {
      console.error('Task list error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Delete task error:', err);
      toast.error(err?.message || 'Failed to delete task');
    }
  };
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = user?.token;
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const task = tasks.find(t => t._id === taskId);
      
      const response = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...task,
          status: newStatus
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to update task status');
      }
      
      const updatedTask = await response.json();
      
      setTasks(tasks.map(t => t._id === taskId ? updatedTask.data : t));
      toast.success('Task status updated successfully!');
    } catch (err) {
      console.error('Update task status error:', err);
      toast.error(err.message);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    
    // Filter by priority
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    
    // Filter by search term
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-200 text-gray-800';
      case 'in-progress':
        return 'bg-blue-200 text-blue-800';
      case 'completed':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-200 text-green-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading tasks...</div>
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
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <Link 
          to="/tasks/new" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Task
        </Link>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <input
            type="text"
            name="search"
            placeholder="Search tasks..."
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow mr-2"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-100 rounded">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                Priority
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No tasks found. Create a new task to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Priority</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(task.status)}`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {task.dueDate ? (
                      <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-500' : ''}>
                        {moment(task.dueDate).format('MMM D, YYYY')}
                      </span>
                    ) : (
                      <span className="text-gray-400">No due date</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">
                      {moment(task.createdAt).fromNow()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/tasks/edit/${task._id}`}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <MdEdit size={20} />
                      </Link>
                      
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(task._id, 'completed')}
                          className="text-green-500 hover:text-green-700"
                          title="Mark as completed"
                        >
                          <MdCheckCircle size={20} />
                        </button>
                      )}
                      
                      {task.status === 'todo' && (
                        <button
                          onClick={() => handleStatusChange(task._id, 'in-progress')}
                          className="text-yellow-500 hover:text-yellow-700"
                          title="Start task"
                        >
                          <FaFilter size={20} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList; 