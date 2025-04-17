import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  MdOutlineTrendingUp, 
  MdOutlineTrendingDown, 
  MdOutlineCheckCircle, 
  MdOutlinePending, 
  MdOutlineAssignment,
  MdOutlineCalendarToday,
  MdOutlineWarning,
  MdOutlineCheckBox,
  MdOutlineHourglassEmpty
} from 'react-icons/md';
import { format, parseISO, isBefore, isAfter, addDays, startOfDay } from 'date-fns';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    overdue: 0,
    dueToday: 0,
    dueThisWeek: 0,
    dueLater: 0
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.data);
      calculateStats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
      setLoading(false);
    }
  };

  const calculateStats = (tasks) => {
    const today = startOfDay(new Date());
    const oneWeekFromNow = addDays(today, 7);
    
    const newStats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      todo: tasks.filter(task => task.status === 'todo').length,
      highPriority: tasks.filter(task => task.priority === 'high').length,
      mediumPriority: tasks.filter(task => task.priority === 'medium').length,
      lowPriority: tasks.filter(task => task.priority === 'low').length,
      overdue: tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = parseISO(task.dueDate);
        return isBefore(dueDate, today);
      }).length,
      dueToday: tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = parseISO(task.dueDate);
        return format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      }).length,
      dueThisWeek: tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = parseISO(task.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, oneWeekFromNow);
      }).length,
      dueLater: tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = parseISO(task.dueDate);
        return isAfter(dueDate, oneWeekFromNow);
      }).length
    };
    setStats(newStats);
  };

  const statusData = [
    { name: 'Completed', value: stats.completed, color: '#10B981' },
    { name: 'In Progress', value: stats.inProgress, color: '#F59E0B' },
    { name: 'To Do', value: stats.todo, color: '#3B82F6' }
  ];

  const priorityData = [
    { name: 'High', value: stats.highPriority, color: '#EF4444' },
    { name: 'Medium', value: stats.mediumPriority, color: '#F59E0B' },
    { name: 'Low', value: stats.lowPriority, color: '#10B981' }
  ];

  const dueDateData = [
    { name: 'Overdue', value: stats.overdue, color: '#EF4444' },
    { name: 'Due Today', value: stats.dueToday, color: '#F59E0B' },
    { name: 'Due This Week', value: stats.dueThisWeek, color: '#3B82F6' },
    { name: 'Due Later', value: stats.dueLater, color: '#10B981' }
  ];

  // Group tasks by due date for the line chart
  const getDueDateLineData = () => {
    const dueDateGroups = {};
    
    tasks.forEach(task => {
      if (!task.dueDate || task.status === 'completed') return;
      
      const dueDate = format(parseISO(task.dueDate), 'yyyy-MM-dd');
      if (!dueDateGroups[dueDate]) {
        dueDateGroups[dueDate] = 0;
      }
      dueDateGroups[dueDate]++;
    });
    
    return Object.entries(dueDateGroups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const dueDateLineData = getDueDateLineData();

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Analytics Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<MdOutlineTrendingUp className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completed}
            icon={<MdOutlineCheckCircle className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<MdOutlinePending className="w-6 h-6 text-yellow-600" />}
            color="bg-yellow-100"
          />
          <StatCard
            title="To Do"
            value={stats.todo}
            icon={<MdOutlineAssignment className="w-6 h-6 text-purple-600" />}
            color="bg-purple-100"
          />
        </div>

        {/* Due Date Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Overdue Tasks"
            value={stats.overdue}
            icon={<MdOutlineWarning className="w-6 h-6 text-red-600" />}
            color="bg-red-100"
          />
          <StatCard
            title="Due Today"
            value={stats.dueToday}
            icon={<MdOutlineCalendarToday className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100"
          />
          <StatCard
            title="Due This Week"
            value={stats.dueThisWeek}
            icon={<MdOutlineHourglassEmpty className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Due Later"
            value={stats.dueLater}
            icon={<MdOutlineCheckBox className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Priority Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Due Date Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Due Date Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Due Date Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dueDateData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dueDateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Due Date Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Due Date Timeline</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dueDateLineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(parseISO(date), 'MMMM d, yyyy')}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Tasks Due" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 