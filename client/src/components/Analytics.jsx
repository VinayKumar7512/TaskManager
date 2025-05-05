import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../redux/slices/taskSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    todo: tasks.filter(task => task.status === 'todo').length,
    highPriority: tasks.filter(task => task.priority === 'high').length,
    mediumPriority: tasks.filter(task => task.priority === 'medium').length,
    lowPriority: tasks.filter(task => task.priority === 'low').length
  };

  // Prepare data for charts
  const statusData = [
    { name: 'Completed', value: stats.completed },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'To Do', value: stats.todo }
  ];

  const priorityData = [
    { name: 'High', value: stats.highPriority },
    { name: 'Medium', value: stats.mediumPriority },
    { name: 'Low', value: stats.lowPriority }
  ];

  // Calculate completion rate
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  if (status === 'loading') return (
    <div className="flex items-center justify-center h-64">
      <div className="text-xl text-gray-600">Loading analytics...</div>
    </div>
  );
  
  if (status === 'failed') return (
    <div className="flex items-center justify-center h-64">
      <div className="text-xl text-red-600">Failed to load analytics data</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Analytics</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-gray-900">{completionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">To Do</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.todo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tasks by Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tasks by Priority</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Priority Distribution</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-[100px,1fr,50px] items-center gap-4">
            <div className="text-gray-600 font-medium">High</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${(stats.highPriority / stats.total) * 100}%` }}
              />
            </div>
            <div className="text-right text-gray-600">{stats.highPriority}</div>
          </div>
          <div className="grid grid-cols-[100px,1fr,50px] items-center gap-4">
            <div className="text-gray-600 font-medium">Medium</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${(stats.mediumPriority / stats.total) * 100}%` }}
              />
            </div>
            <div className="text-right text-gray-600">{stats.mediumPriority}</div>
          </div>
          <div className="grid grid-cols-[100px,1fr,50px] items-center gap-4">
            <div className="text-gray-600 font-medium">Low</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${(stats.lowPriority / stats.total) * 100}%` }}
              />
            </div>
            <div className="text-right text-gray-600">{stats.lowPriority}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 