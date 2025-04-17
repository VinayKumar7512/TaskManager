/**
 * Utility functions for managing user settings
 */
import { info, error as notifyError } from './notificationUtils';
import { initializeDarkMode } from './darkModeUtils';

const DEFAULT_SETTINGS = {
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
};

/**
 * Apply settings to the application
 * @param {Object} settings - The settings object to apply
 */
export const applySettings = (settings) => {
  try {
    if (!settings || typeof settings !== 'object') {
      throw new Error('Invalid settings object');
    }

    // Merge with default settings
    const mergedSettings = {
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...(settings.notifications || {})
      },
      display: {
        ...DEFAULT_SETTINGS.display,
        ...(settings.display || {})
      },
      taskDefaults: {
        ...DEFAULT_SETTINGS.taskDefaults,
        ...(settings.taskDefaults || {})
      }
    };

    // Store settings in localStorage
    localStorage.setItem('userSettings', JSON.stringify(mergedSettings));

    // Apply dark mode
    if (mergedSettings.display.darkMode) {
      initializeDarkMode();
    }

    // Dispatch settings changed event
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: mergedSettings }));

    return mergedSettings;
  } catch (err) {
    console.error('Error applying settings:', err);
    throw new Error('Failed to apply settings');
  }
};

/**
 * Get settings from localStorage
 * @returns {Object} The settings object
 */
export const getSettings = () => {
  try {
    const settings = localStorage.getItem('userSettings');
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
  } catch (err) {
    console.error('Error getting settings:', err);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Get task defaults from localStorage
 * @returns {Object} The task defaults object
 */
export const getTaskDefaults = () => {
  try {
    const settings = getSettings();
    return settings.taskDefaults || DEFAULT_SETTINGS.taskDefaults;
  } catch (err) {
    console.error('Error getting task defaults:', err);
    return DEFAULT_SETTINGS.taskDefaults;
  }
};

/**
 * Initialize settings on app load
 */
export const initializeSettings = () => {
  try {
    const settings = getSettings();
    applySettings(settings);
    return settings;
  } catch (err) {
    console.error('Error initializing settings:', err);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Check if dark mode is enabled
 * @returns {boolean} True if dark mode is enabled
 */
export const isDarkMode = () => {
  try {
    const settings = getSettings();
    return settings.display?.darkMode || false;
  } catch (error) {
    console.error('Error checking dark mode:', error);
    return false;
  }
}; 