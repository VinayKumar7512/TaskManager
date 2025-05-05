import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../redux/slices/taskSlice';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);
  
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Calculate statistics from tasks
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    todo: tasks.filter(task => task.status === 'todo').length
  };

  // Get recent tasks (last 5)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (status === 'loading') return <div className="loading">Loading...</div>;
  if (status === 'failed') return <div className="error">Failed to load dashboard data</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/tasks/new" className="btn-primary">Create New Task</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{stats.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Todo</h3>
          <p className="stat-number">{stats.todo}</p>
        </div>
      </div>

      <div className="priority-stats">
        <h2>Tasks by Priority</h2>
        <div className="priority-bars">
          <div className="priority-bar">
            <div className="priority-label">High</div>
            <div className="bar-container">
              <div
                className="bar high"
                style={{ width: `${(stats.highPriority / stats.total) * 100}%` }}
              />
            </div>
            <div className="priority-count">{stats.highPriority}</div>
          </div>
          <div className="priority-bar">
            <div className="priority-label">Medium</div>
            <div className="bar-container">
              <div
                className="bar medium"
                style={{ width: `${(stats.mediumPriority / stats.total) * 100}%` }}
              />
            </div>
            <div className="priority-count">{stats.mediumPriority}</div>
          </div>
          <div className="priority-bar">
            <div className="priority-label">Low</div>
            <div className="bar-container">
              <div
                className="bar low"
                style={{ width: `${(stats.lowPriority / stats.total) * 100}%` }}
              />
            </div>
            <div className="priority-count">{stats.lowPriority}</div>
          </div>
        </div>
      </div>

      <div className="recent-tasks">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="view-all">View All</Link>
        </div>
        <div className="task-list">
          {recentTasks.map(task => (
            <div key={task._id} className="task-item">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div className="task-meta">
                <span className={`status ${task.status}`}>{task.status}</span>
                <span className={`priority ${task.priority}`}>{task.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 