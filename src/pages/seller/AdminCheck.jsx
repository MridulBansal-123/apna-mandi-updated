import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toggleAdminOpen } from '../../utils/admintoggleSlice';

const AdminCheck = () => {
  const [requirements, setRequirements] = useState([]);
  const dispatch = useDispatch();

  const fetchRequirements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requirement');
      setRequirements(res.data);
      
    } catch (err) {
      console.error('Error fetching:', err);
    }
  };
  

  const deleteRequirement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/requirement/${id}`);
      setRequirements((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleCancel = () => {
    dispatch(toggleAdminOpen());
  };

  useEffect(() => {
    fetchRequirements();
    const interval = setInterval(fetchRequirements, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🛒 Admin Requirement List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {requirements.map((req) => (
          <div
            key={req._id}
            className="bg-white border-l-4 border-blue-500 shadow-md p-4 rounded-lg space-y-1"
          >
            <h2 className="text-lg font-semibold text-gray-900">{req.productName}</h2>
            <p className="text-sm text-gray-700">📦 Category: <span className="font-medium">{req.category || 'N/A'}</span></p>
            <p className="text-sm text-gray-700">📏 Quantity: <span className="font-medium">{req.quantity} {req.unit}</span></p>
            <p className="text-sm text-gray-700">💰 Max Price: <span className="font-medium">{req.maxPrice || 'N/A'}</span></p>
            <p className="text-sm text-gray-700">⚠️ Urgency: <span className={`font-bold ${req.urgency === 'High' ? 'text-red-600' : req.urgency === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{req.urgency}</span></p>
            <p className="text-sm text-gray-700">📅 Deadline: <span className="font-medium">{req.deadline ? new Date(req.deadline).toLocaleDateString() : 'N/A'}</span></p>
            <p className="text-sm text-gray-700">📝 Description: <span className="font-medium">{req.description || 'No description'}</span></p>
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => deleteRequirement(req._id)}
                className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleCancel}
        className="mt-6 bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition"
      >
        Cancel
      </button>
    </div>
  );
};

export default AdminCheck;
