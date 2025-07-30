import React, { createContext, useContext, useState, useEffect } from 'react';
import useStore from '../store';
import { notificationAPI } from '../utils/api';
import { notificationEvents, NOTIFICATION_EVENTS } from '../utils/notificationEvents';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { token } = useStore();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(null);

  // Fetch notifications from the server
  const fetchNotifications = async (options = {}) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 20,
        unreadOnly: options.unreadOnly || false
      };

      const response = await notificationAPI.getNotifications(params);
      const data = response.data;
      
      // Check if there are new notifications
      const hasNewNotifications = data.notifications.some(
        newNotif => !notifications.find(existingNotif => existingNotif._id === newNotif._id)
      );
      
      if (hasNewNotifications) {
        setLastActivity(Date.now());
      }
      
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    if (!token) return;

    try {
      await notificationAPI.markAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, read: true, readAt: new Date() }
            : notif
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!token) return;

    try {
      await notificationAPI.markAllAsRead();

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    if (!token) return;

    try {
      await notificationAPI.deleteNotification(notificationId);

      // Update local state
      const notificationToDelete = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error deleting notification:', err);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!token) return;

    try {
      await notificationAPI.clearAll();

      // Update local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error clearing all notifications:', err);
    }
  };

  // Get notification stats
  const getNotificationStats = async () => {
    if (!token) return;

    try {
      const response = await notificationAPI.getStats();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error fetching notification stats:', err);
    }
  };

  // Format notification time
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
    
    return time.toLocaleDateString();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconMap = {
      // Order related
      ORDER_PLACED: '🛒',
      ORDER_RECEIVED: '📦',
      ORDER_ACCEPTED: '✅',
      ORDER_ASSIGNED: '👤',
      ORDER_ASSIGNED_TO_SELLER: '🏪',
      ORDER_SCHEDULED: '📅',
      ORDER_OUT_FOR_DELIVERY: '🚚',
      ORDER_DELIVERED: '✅',
      ORDER_DECLINED: '❌',
      ORDER_CANCELLED: '🚫',
      
      // Product related
      PRODUCT_LISTED: '📋',
      STOCK_LOW: '⚠️',
      PRODUCT_OUT_OF_STOCK: '❌',
      LOW_STOCK_ALERT: '⚠️',
      
      // Payment related
      PAYMENT_CONFIRMED: '💰',
      PAYMENT_RECEIVED: '💵',
      
      // Admin related
      NEW_ORDER: '🆕',
      NEW_SELLER_REGISTRATION: '👨‍💼',
      NEW_BUYER_REGISTRATION: '👤',
      NEW_LISTING: '📝'
    };
    
    return iconMap[type] || '📢';
  };

  // Get notification color based on priority
  const getPriorityColor = (priority) => {
    const colorMap = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    
    return colorMap[priority] || 'text-gray-500';
  };

  // Load notifications when token changes
  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token]);

  // Listen for notification events
  useEffect(() => {
    const handleRefreshNotifications = () => {
      setLastActivity(Date.now());
      refreshNotifications();
    };

    notificationEvents.on(NOTIFICATION_EVENTS.REFRESH_NOTIFICATIONS, handleRefreshNotifications);
    notificationEvents.on(NOTIFICATION_EVENTS.ORDER_PLACED, handleRefreshNotifications);
    notificationEvents.on(NOTIFICATION_EVENTS.ORDER_ASSIGNED, handleRefreshNotifications);

    return () => {
      notificationEvents.off(NOTIFICATION_EVENTS.REFRESH_NOTIFICATIONS, handleRefreshNotifications);
      notificationEvents.off(NOTIFICATION_EVENTS.ORDER_PLACED, handleRefreshNotifications);
      notificationEvents.off(NOTIFICATION_EVENTS.ORDER_ASSIGNED, handleRefreshNotifications);
    };
  }, []);

  // Dynamic polling - more frequent when there's recent activity
  useEffect(() => {
    if (!token) return;

    const getPollingInterval = () => {
      const now = Date.now();
      const timeSinceLastActivity = lastActivity ? now - lastActivity : Infinity;
      
      // If there was recent activity (within 2 minutes), poll every 5 seconds
      if (timeSinceLastActivity < 120000) {
        return 5000;
      }
      // Otherwise, poll every 15 seconds
      return 15000;
    };

    const startPolling = () => {
      const interval = setInterval(() => {
        fetchNotifications({ unreadOnly: true });
      }, getPollingInterval());
      return interval;
    };

    let interval = startPolling();

    // Restart polling when lastActivity changes to adjust interval
    if (lastActivity) {
      clearInterval(interval);
      interval = startPolling();
    }

    return () => clearInterval(interval);
  }, [token, lastActivity]);

  // Force refresh notifications (for manual triggers)
  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationStats,
    getTimeAgo,
    getNotificationIcon,
    getPriorityColor
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
