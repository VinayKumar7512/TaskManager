import React, { useState, useEffect } from 'react';
import { success, error } from '../utils/notificationUtils';
import { applySettings, getSettings, initializeSettings } from '../utils/settingsUtils';
import { toggleDarkMode } from '../utils/darkModeUtils';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      taskReminders: true,
      weeklyDigest: false
    },
    display: {
      darkMode: false,
      compactView: false,
      showCompletedTasks: true
    },
    taskDefaults: {
      defaultPriority: 'medium',
      defaultStatus: 'todo',
      defaultDueDate: '7'
    }
  });

  useEffect(() => {
    // Initialize settings on component mount
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          error('Please login to access settings');
          return;
        }

        const response = await axios.get(`${API_URL}/users/settings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.status) {
          const serverSettings = response.data.settings;
          setSettings(serverSettings);
          
          // Apply settings locally
          applySettings(serverSettings);
          
          // Apply dark mode if enabled
          if (serverSettings.display?.darkMode) {
            toggleDarkMode(true);
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        if (err.response?.status === 401) {
          error('Please login to access settings');
        } else {
          error('Failed to load settings. Please try again.');
        }
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (category, setting, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };
    setSettings(newSettings);
    
    // Apply dark mode immediately if it's being toggled
    if (category === 'display' && setting === 'darkMode') {
      toggleDarkMode(value);
      // Save to localStorage immediately for persistence
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      // Apply settings locally
      applySettings(newSettings);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        error('Please login to save settings');
        return;
      }

      // Save to server
      const response = await axios.put(`${API_URL}/users/settings`, 
        { settings },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status) {
        // Apply settings locally
        applySettings(settings);
        // Save to localStorage
        localStorage.setItem('userSettings', JSON.stringify(settings));
        // Ensure dark mode is applied
        if (settings.display?.darkMode) {
          toggleDarkMode(true);
        }
        success('Settings saved successfully!');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      if (err.response?.status === 401) {
        error('Please login to save settings');
      } else {
        error('Failed to save settings. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark mb-8">Settings</h1>
        
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-dark"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Task Reminders</label>
              <input
                type="checkbox"
                checked={settings.notifications.taskReminders}
                onChange={(e) => handleSettingChange('notifications', 'taskReminders', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-dark"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Weekly Digest</label>
              <input
                type="checkbox"
                checked={settings.notifications.weeklyDigest}
                onChange={(e) => handleSettingChange('notifications', 'weeklyDigest', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-dark"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark mb-4">Display</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Dark Mode</label>
              <input
                type="checkbox"
                checked={settings.display.darkMode}
                onChange={(e) => handleSettingChange('display', 'darkMode', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-dark"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Compact View</label>
              <input
                type="checkbox"
                checked={settings.display.compactView}
                onChange={(e) => handleSettingChange('display', 'compactView', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-dark"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Show Completed Tasks</label>
              <input
                type="checkbox"
                checked={settings.display.showCompletedTasks}
                onChange={(e) => handleSettingChange('display', 'showCompletedTasks', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-dark"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark mb-4">Task Defaults</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Default Priority</label>
              <select
                value={settings.taskDefaults.defaultPriority}
                onChange={(e) => handleSettingChange('taskDefaults', 'defaultPriority', e.target.value)}
                className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-dark-tertiary dark:text-dark dark:border-dark"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Default Status</label>
              <select
                value={settings.taskDefaults.defaultStatus}
                onChange={(e) => handleSettingChange('taskDefaults', 'defaultStatus', e.target.value)}
                className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-dark-tertiary dark:text-dark dark:border-dark"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-dark-secondary">Default Due Date (days)</label>
              <select
                value={settings.taskDefaults.defaultDueDate}
                onChange={(e) => handleSettingChange('taskDefaults', 'defaultDueDate', e.target.value)}
                className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-dark-tertiary dark:text-dark dark:border-dark"
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">1 week</option>
                <option value="14">2 weeks</option>
                <option value="30">1 month</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 