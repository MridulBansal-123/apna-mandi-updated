// Simple event emitter for real-time notifications
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

export const notificationEvents = new EventEmitter();

// Event types
export const NOTIFICATION_EVENTS = {
  NEW_NOTIFICATION: 'new_notification',
  REFRESH_NOTIFICATIONS: 'refresh_notifications',
  ORDER_PLACED: 'order_placed',
  ORDER_ASSIGNED: 'order_assigned'
};
