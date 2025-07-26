import React, { useState } from 'react';
import useStore from '../../store';
import { api } from '../../utils/api';
import { toast } from 'sonner';

export default function DeleteAccountModal({ isOpen, onClose }) {
    const { logout } = useStore();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete('/auth/profile');
            toast.success("Your account has been deleted.");
            logout();
        } catch (error) {
            toast.error("Failed to delete account.");
        } finally {
            setLoading(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Are you sure?</h2>
                <p className="text-gray-600 mb-6">This action is permanent and cannot be undone.</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleDelete} disabled={loading} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300">
                        {loading? 'Deleting...' : 'Confirm Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
