/**
 * Simple notification utility that doesn't rely on external libraries
 */

// Create a notification container if it doesn't exist
const createNotificationContainer = () => {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  return container;
};

// Show a notification
export const showNotification = (message, type = 'info') => {
  try {
    const container = createNotificationContainer();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.style.padding = '12px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.color = 'white';
    notification.style.maxWidth = '300px';
    notification.style.wordBreak = 'break-word';
    notification.style.transition = 'opacity 0.5s ease';
    
    // Set background color based on type
    switch (type) {
      case 'success':
        notification.style.backgroundColor = '#4CAF50';
        break;
      case 'error':
        notification.style.backgroundColor = '#F44336';
        break;
      case 'warning':
        notification.style.backgroundColor = '#FF9800';
        break;
      default:
        notification.style.backgroundColor = '#2196F3';
    }
    
    // Add message
    notification.textContent = message;
    
    // Add to container
    container.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (container.contains(notification)) {
          container.removeChild(notification);
        }
      }, 500);
    }, 3000);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

// Convenience methods
export const success = (message) => showNotification(message, 'success');
export const error = (message) => showNotification(message, 'error');
export const warning = (message) => showNotification(message, 'warning');
export const info = (message) => showNotification(message, 'info'); 