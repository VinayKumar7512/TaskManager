import React, { useEffect, useState } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdPerson,
  MdEmail,
  MdCalendarToday,
  MdEdit,
  MdCheckCircle,
  MdPendingActions,
  MdAssignment,
  MdAdd,
  MdTrendingUp,
  MdTrendingDown,
  MdTrendingFlat
} from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { FaNewspaper, FaChartBar, FaChartPie, FaChartLine } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const TaskTable = ({ tasks, title }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-200 dark:border-gray-700'>
      <tr className='text-gray-700 dark:text-gray-300 text-left'>
        <th className='py-3 px-4'>Task Title</th>
        <th className='py-3 px-4'>Priority</th>
        <th className='py-3 px-4'>Status</th>
        <th className='py-3 px-4 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
      <td className='py-3 px-4'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.status])}
          />

          <p className='text-base text-gray-800 dark:text-gray-200 font-medium'>{task.title}</p>
        </div>
      </td>

      <td className='py-3 px-4'>
        <div className='flex gap-1 items-center'>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className='capitalize'>{task.priority}</span>
        </div>
      </td>

      <td className='py-3 px-4'>
        <span className='capitalize px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800'>
          {task.status}
        </span>
      </td>
      
      <td className='py-3 px-4 hidden md:block'>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {moment(task?.createdAt).fromNow()}
        </span>
      </td>
    </tr>
  );
  
  return (
    <>
      <div className='w-full bg-white dark:bg-gray-800 px-4 pt-4 pb-4 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700'>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
          <Link to="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
};

const UserProfile = ({ user, stats }) => {
  if (!user) return null;
  
  // Ensure we have default values for all user properties
  const userData = {
    name: user.name || 'User',
    email: user.email || 'No email provided',
    role: user.role || 'User',
    createdAt: user.createdAt || new Date().toISOString(),
    isActive: user.isActive !== undefined ? user.isActive : true,
    title: user.title || 'No title',
    id: user.id || user._id || 'Unknown ID'
  };
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {getInitials(userData.name)}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{userData.name}</h2>
            <Link to="/profile" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm font-medium">
              <MdEdit size={18} />
              <span>Edit Profile</span>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MdEmail className="text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{userData.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MdPerson className="text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 capitalize">{userData.role}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MdCalendarToday className="text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Joined {moment(userData.createdAt).format('MMMM YYYY')}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Account Status</h3>
            <div className={clsx(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              userData.isActive 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            )}>
              {userData.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Task Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.total || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed Tasks</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.completed || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tasks In Progress</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.inProgress || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Todo Tasks</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.todo || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        console.log('Using token from localStorage:', token);

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5001/api/tasks/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Stats response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || 'Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        console.log('Stats data:', data);
        setStats(data.data);
        
        // Fetch recent tasks
        const tasksResponse = await fetch('http://localhost:5001/api/tasks?limit=5', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Tasks response status:', tasksResponse.status);
        
        if (!tasksResponse.ok) {
          const errorData = await tasksResponse.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || 'Failed to fetch recent tasks');
        }
        
        const tasksData = await tasksResponse.json();
        console.log('Tasks data:', tasksData);
        setRecentTasks(tasksData.data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchTasksByStatus = async (status) => {
    try {
      setLoading(true);
      setSelectedStatus(status);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`http://localhost:5001/api/tasks?status=${status}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      
      const data = await response.json();
      setSelectedTasks(data.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Card = ({ label, count, bg, icon, onClick }) => (
    <div 
      className={`${bg} p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{count}</p>
        </div>
        <div className="text-3xl text-gray-700 dark:text-gray-300">
          {icon}
        </div>
        </div>
      </div>
    );

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  if (loading) {
  return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full py-4">
      <div className="w-full h-full flex flex-col gap-6 2xl:gap-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-blue-100">Here's what's happening with your tasks today.</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            label="Total Tasks" 
            count={stats.total || 0} 
            bg="bg-white dark:bg-gray-800" 
            icon={<FaChartBar />} 
            onClick={() => fetchTasksByStatus(null)}
          />
          <Card 
            label="Completed Tasks" 
            count={stats.completed || 0} 
            bg="bg-green-50 dark:bg-green-900/20" 
            icon={<MdCheckCircle className="text-green-500" />} 
            onClick={() => fetchTasksByStatus('completed')}
          />
          <Card 
            label="In Progress" 
            count={stats.inProgress || 0} 
            bg="bg-blue-50 dark:bg-blue-900/20" 
            icon={<MdPendingActions className="text-blue-500" />} 
            onClick={() => fetchTasksByStatus('in-progress')}
          />
          <Card 
            label="Todo Tasks" 
            count={stats.todo || 0} 
            bg="bg-yellow-50 dark:bg-yellow-900/20" 
            icon={<MdAssignment className="text-yellow-500" />} 
            onClick={() => fetchTasksByStatus('todo')}
          />
      </div>

        {/* Priority Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Task Priority</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MdKeyboardDoubleArrowUp className="text-red-500 text-xl" />
                  <span className="text-gray-700 dark:text-gray-300">High Priority</span>
                </div>
                <span className="text-gray-800 dark:text-white font-medium">{stats.highPriority || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MdKeyboardArrowUp className="text-yellow-500 text-xl" />
                  <span className="text-gray-700 dark:text-gray-300">Medium Priority</span>
                </div>
                <span className="text-gray-800 dark:text-white font-medium">{stats.mediumPriority || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MdKeyboardArrowDown className="text-green-500 text-xl" />
                  <span className="text-gray-700 dark:text-gray-300">Low Priority</span>
                </div>
                <span className="text-gray-800 dark:text-white font-medium">{stats.lowPriority || 0}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
              <Link to="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">View All</Link>
            </div>
            <div className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.status])} />
                      <div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{task.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{moment(task.createdAt).fromNow()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
                        {task.priority === 'high' ? <MdKeyboardDoubleArrowUp /> : 
                         task.priority === 'medium' ? <MdKeyboardArrowUp /> : 
                         <MdKeyboardArrowDown />}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent tasks found</p>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaskTable tasks={recentTasks} title="Recent Tasks" />
          <TaskTable tasks={selectedTasks} title={selectedStatus ? `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Tasks` : "All Tasks"} />
        </div>

        {/* User Profile */}
        {showProfile && <UserProfile user={user} stats={stats} />}
      </div>
    </div>
  );
};

export default Dashboard;