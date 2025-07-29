import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toggleOpen } from '../../utils/toggleSlice';

const RequirementForm = () => {
  const [form, setForm] = useState({
    productName: '',
    category: '',
    quantity: '',
    unit: 'Kilogram (kg)',
    maxPrice: '',
    urgency: 'Medium',
    deadline: '',
    description: ''
  });
  const disaptch=useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        
      await axios.post('http://localhost:5000/api/requirement', form);
     console.log("posted")
    } catch (err) {
      console.log(err.message)
    }
  };

  const handleCancel = () => {
    setForm({
      productName: '',
      category: '',
      quantity: '',
      unit: 'Kilogram (kg)',
      maxPrice: '',
      urgency: 'Medium',
      deadline: '',
      description: ''
    });
    disaptch(toggleOpen())
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Post New Requirement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="productName"
          value={form.productName}
          onChange={handleChange}
          placeholder="e.g. Fresh Onions"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Vegetables"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="e.g. 50"
            required
            className="col-span-1 p-3 border border-gray-300 rounded-md"
          />
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="col-span-1 p-3 border border-gray-300 rounded-md"
          >
            <option>Kilogram (kg)</option>
            <option>Gram (g)</option>
            <option>Litre (l)</option>
          </select>
          <input
            name="maxPrice"
            type="number"
            value={form.maxPrice}
            onChange={handleChange}
            placeholder="Max Price (₹)"
            className="col-span-1 p-3 border border-gray-300 rounded-md"
          />
        </div>
        <select
          name="urgency"
          value={form.urgency}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Any specific requirements or details..."
          className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]"
        />
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Post Requirement
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequirementForm;
