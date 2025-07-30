import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { getTimeAgo, getNotificationIcon, getPriorityColor } = useNotifications();

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
  };

  const getNotificationTypeColor = (type) => {
    const colorMap = {
      // Order related - Blue
      ORDER_PLACED: 'border-blue-500',
      ORDER_RECEIVED: 'border-blue-500',
      ORDER_ACCEPTED: 'border-green-500',
      ORDER_ASSIGNED: 'border-blue-500',
      ORDER_ASSIGNED_TO_SELLER: 'border-blue-500',
      ORDER_SCHEDULED: 'border-purple-500',
      ORDER_OUT_FOR_DELIVERY: 'border-yellow-500',
      ORDER_DELIVERED: 'border-green-500',
      ORDER_DECLINED: 'border-red-500',
      ORDER_CANCELLED: 'border-red-500',
      
      // Product related - Orange
      PRODUCT_LISTED: 'border-orange-500',
      STOCK_LOW: 'border-orange-500',
      PRODUCT_OUT_OF_STOCK: 'border-red-500',
      LOW_STOCK_ALERT: 'border-orange-500',
      
      // Payment related - Green
      PAYMENT_CONFIRMED: 'border-green-500',
      PAYMENT_RECEIVED: 'border-green-500',
      
      // Admin related - Purple
      NEW_ORDER: 'border-purple-500',
      NEW_SELLER_REGISTRATION: 'border-purple-500',
      NEW_BUYER_REGISTRATION: 'border-purple-500',
      NEW_LISTING: 'border-purple-500'
    };
    
    return colorMap[type] || 'border-gray-300';
  };

  const getActionableButtons = (type, data) => {
    const buttons = [];
    
    if (type === 'ORDER_RECEIVED' && data?.orderId) {
      buttons.push(
        <button
          key="view-order"
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-md transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Navigate to order details or handle order action
            console.log('View order:', data.orderId);
          }}
        >
          View Order
        </button>
      );
    }
    
    if (type === 'ORDER_ASSIGNED' && data?.orderId) {
      buttons.push(
        <button
          key="accept-order"
          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded-md transition-colors mr-1"
          onClick={(e) => {
            e.stopPropagation();
            // Handle order acceptance
            console.log('Accept order:', data.orderId);
          }}
        >
          Accept
        </button>,
        <button
          key="decline-order"
          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded-md transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Handle order decline
            console.log('Decline order:', data.orderId);
          }}
        >
          Decline
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-200 transition-all duration-200 cursor-pointer border-l-4 ${
        notification.read
          ? 'border-gray-200 dark:border-dark-200'
          : `${getNotificationTypeColor(notification.type)} bg-blue-50/30 dark:bg-blue-900/10`
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-lg mt-0.5 flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <p className={`text-sm font-medium break-words ${
                notification.read 
                  ? 'text-gray-600 dark:text-dark-600' 
                  : 'text-gray-900 dark:text-dark-900'
              }`}>
                {notification.title}
              </p>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2 flex-shrink-0"></div>
              )}
            </div>
            
            <p className="text-xs text-gray-500 dark:text-dark-400 mt-1 break-words">
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400 dark:text-dark-500">
                {getTimeAgo(notification.createdAt)}
              </p>
              
              <div className="flex items-center space-x-2">
                {notification.priority === 'high' || notification.priority === 'urgent' ? (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    notification.priority === 'urgent' 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}>
                    {notification.priority}
                  </span>
                ) : null}
              </div>
            </div>
            
            {/* Action buttons for specific notification types */}
            {getActionableButtons(notification.type, notification.data).length > 0 && (
              <div className="flex space-x-2 mt-2">
                {getActionableButtons(notification.type, notification.data)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationList = ({ notifications, onMarkAsRead, loading, unreadCount, onMarkAllAsRead, onClearAll, onRefresh }) => {
  if (loading && notifications.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-500 dark:text-dark-400">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <svg className="w-12 h-12 text-gray-300 dark:text-dark-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm0 0H9a2 2 0 01-2-2V7a7 7 0 1114 0v8a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-gray-500 dark:text-dark-400">No notifications</p>
        <p className="text-xs text-gray-400 dark:text-dark-500 mt-1">You're all caught up!</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-900 flex items-center">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
          {loading && (
            <div className="ml-2 w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          )}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onRefresh}
            className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors flex items-center"
            title="Refresh notifications"
          >
            <svg className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Read All
            </button>
          )}
          <button
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </>
  );
};

export default NotificationList;
