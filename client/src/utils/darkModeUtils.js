/**
 * Utility functions for handling dark mode
 */

/**
 * Initialize dark mode based on user preferences
 */
export const initializeDarkMode = () => {
  try {
    // Check if user has a preference in localStorage
    const userSettings = localStorage.getItem('userSettings');
    if (userSettings) {
      const settings = JSON.parse(userSettings);
      if (settings.display?.darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  } catch (error) {
    console.error('Error initializing dark mode:', error);
  }
};

/**
 * Toggle dark mode
 * @param {boolean} isDark - Whether dark mode should be enabled
 */
export const toggleDarkMode = (isDark) => {
  try {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  } catch (error) {
    console.error('Error toggling dark mode:', error);
  }
}; 