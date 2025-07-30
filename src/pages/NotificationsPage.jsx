import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import useStore from '../store';

const NotificationsPage = () => {
  const { user } = useStore();
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getTimeAgo,
    getNotificationIcon,
    getPriorityColor
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all');
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    return true;
  });

  const notificationTypes = [...new Set(notifications.map(n => n.type))];

  const getRoleBasedMessage = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'Admin':
        return 'Manage system notifications, new registrations, and order alerts.';
      case 'Seller':
        return 'Stay updated on new orders, stock alerts, and payment confirmations.';
      case 'Buyer':
        return 'Track your orders and receive updates on delivery status.';
      default:
        return 'Stay updated with important notifications.';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-dark-200 rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <p className="text-gray-600">Please log in to view your notifications.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-900 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-dark-600 mb-4">
            {getRoleBasedMessage()}
          </p>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white dark:bg-dark-200 px-4 py-2 rounded-lg shadow">
                <span className="text-sm font-medium text-gray-600 dark:text-dark-600">Total: </span>
                <span className="text-lg font-bold text-blue-600">{notifications.length}</span>
              </div>
              <div className="bg-white dark:bg-dark-200 px-4 py-2 rounded-lg shadow">
                <span className="text-sm font-medium text-gray-600 dark:text-dark-600">Unread: </span>
                <span className="text-lg font-bold text-orange-600">{unreadCount}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Mark All Read
                </button>
              )}
              <button
                onClick={() => fetchNotifications()}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-dark-200 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-600 dark:text-dark-600">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 dark:border-dark-300 rounded-lg px-3 py-1 text-sm bg-white dark:bg-dark-100"
              >
                <option value="all">All ({notifications.length})</option>
                <option value="unread">Unread ({unreadCount})</option>
                <option value="read">Read ({notifications.length - unreadCount})</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-600 dark:text-dark-600">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 dark:border-dark-300 rounded-lg px-3 py-1 text-sm bg-white dark:bg-dark-100"
              >
                <option value="all">All Types</option>
                {notificationTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            {filteredNotifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors ml-auto"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading && notifications.length === 0 ? (
            <div className="bg-white dark:bg-dark-200 rounded-lg shadow-md p-8 text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-dark-200 rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 dark:text-dark-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm0 0H9a2 2 0 01-2-2V7a7 7 0 1114 0v8a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500 dark:text-dark-400">
                {filter === 'all' 
                  ? "You're all caught up! No notifications to show."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white dark:bg-dark-200 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-2xl mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`text-lg font-medium ${
                            notification.read ? 'text-gray-700 dark:text-dark-700' : 'text-gray-900 dark:text-dark-900'
                          }`}>
                            {notification.title}
                          </h3>
                          
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.priority === 'urgent' 
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                              : notification.priority === 'high'
                              ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {notification.priority}
                          </span>
                          
                          <span className="text-xs bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-1 rounded-full">
                            {notification.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-dark-600 mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-dark-500">
                          <span>{getTimeAgo(notification.createdAt)}</span>
                          {notification.read && notification.readAt && (
                            <span>Read: {getTimeAgo(notification.readAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                      
                      {!notification.read && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
