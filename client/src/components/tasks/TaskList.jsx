import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdEdit, MdDelete, MdCheckCircle, MdPlayArrow, MdAdd } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';
import { deleteTask, updateTaskStatus, fetchTasks } from '../../redux/slices/taskSlice';

const TaskList = () => {
  const { user } = useSelector((state) => state.auth);
  const { tasks: reduxTasks, status } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      dispatch(fetchTasks());
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Delete task error:', err);
      toast.error(err?.message || 'Failed to delete task');
    }
  };
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const result = await dispatch(updateTaskStatus({ id: taskId, status: newStatus })).unwrap();
      
      if (result.success) {
        dispatch(fetchTasks());
        toast.success('Task status updated successfully!');
      }
    } catch (err) {
      console.error('Update task status error:', err);
      toast.error(err?.message || 'Failed to update task status');
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const filteredTasks = reduxTasks.filter(task => {
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
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };
  
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }
  
  if (status === 'failed') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Failed to load tasks. Please try again later.
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Tasks</h2>
          <p className="text-gray-500 mt-1">Manage your tasks and track progress</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <FaFilter className="text-gray-500" />
            <span>Filters</span>
          </button>
          <Link
            to="/tasks/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MdAdd size={20} />
            <span>New Task</span>
          </Link>
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
              Priority
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="search">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Search tasks..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      )}
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No tasks found. Create a new task to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => (
                <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.dueDate ? (
                      <span className={`text-sm ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600' : 'text-gray-600'}`}>
                        {moment(task.dueDate).format('MMM D, YYYY')}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">No due date</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {moment(task.createdAt).fromNow()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-3">
                      <Link
                        to={`/tasks/edit/${task._id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <MdEdit size={20} />
                      </Link>
                      
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(task._id, 'completed')}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Mark as completed"
                        >
                          <MdCheckCircle size={20} />
                        </button>
                      )}
                      
                      {task.status === 'todo' && (
                        <button
                          onClick={() => handleStatusChange(task._id, 'in-progress')}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Start task"
                        >
                          <MdPlayArrow size={20} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
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