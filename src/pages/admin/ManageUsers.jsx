import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to fetch users.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-purple-500 to-indigo-600';
      case 'seller':
        return 'from-emerald-500 to-green-600';
      case 'buyer':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400';
      case 'suspended':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Manage Users
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-dark-900">User Management</p>
            <p className="text-sm text-gray-500 dark:text-dark-500">{filteredUsers.length} users</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative glass-effect rounded-3xl p-6 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-indigo-900/10 rounded-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="glass-input pl-10 pr-4 py-3 w-full text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="md:w-48">
            <select
              className="glass-input px-4 py-3 w-full text-gray-900 dark:text-dark-900"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid gap-6">
        {filteredUsers.length === 0 ? (
          <div className="relative glass-effect rounded-3xl p-12 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-gray-50/30 to-gray-50/50 dark:from-gray-900/10 dark:via-gray-900/5 dark:to-gray-900/10 rounded-3xl -z-10"></div>
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 dark:text-dark-400">No users found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="relative group glass-effect rounded-3xl p-6 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/5 to-white/5 dark:from-gray-900/10 dark:via-gray-900/5 dark:to-gray-900/10 rounded-3xl -z-10"></div>
                
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-dark-900">{user.name || 'Unknown User'}</h3>
                      <p className="text-sm text-gray-600 dark:text-dark-300">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)} bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm capitalize`}>
                    {user.status || 'active'}
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-dark-300">Role</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${getRoleColor(user.role)} text-white capitalize`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-dark-300">Joined</span>
                    <span className="text-gray-900 dark:text-dark-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-dark-300">Phone</span>
                      <span className="text-gray-900 dark:text-dark-900">{user.phone}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.status)}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      user.status === 'active'
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/30'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30'
                    }`}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl text-sm font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getRoleColor(user.role)} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-20`}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
