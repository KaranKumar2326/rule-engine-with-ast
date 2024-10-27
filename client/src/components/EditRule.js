// src/components/EditRule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { set } from 'mongoose';

function EditRule() {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [ruleString, setRuleString] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all rules on component mount
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rules/get-rules');
        console.log('Fetched rules:', response.data);
        setRules(response.data);
      } catch (error) {
        console.error('Failed to fetch rules:', error);
        setMessage('Failed to fetch rules from the server.');
      }
    };

    fetchRules();
  }, []);

  const handleSelectChange = (e) => {
    const selected = rules.find(rule => rule._id === e.target.value);
    setSelectedRule(selected);
    setMessage('');
    setRuleString(selected ? selected.ruleString : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!selectedRule) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/rules/update/${selectedRule._id}`, { ruleString });
      setMessage('Rule updated successfully');
      console.log('Updated rule:', response.data);
    } catch (error) {
      console.error('Failed to update rule:', error);
      setMessage(error.response?.data?.error || 'Failed to update rule');
    }
  };

  return (
    <div className="flex flex-col items-center p-6mt-8">
      <form className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md rounded-sm  p-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Rule</h2>
        <select
          className="w-full p-2 mb-4 border rounded-lg text-gray-700"
          onChange={handleSelectChange}
          value={selectedRule ? selectedRule._id : ''}
        >
          <option value="">Select a rule to edit</option>
          {rules.map(rule => (
            <option key={rule._id} value={rule._id}>
              {rule.ruleString}
            </option>
          ))}
        </select>

        {selectedRule && (
          <>
            <input
              className="w-full p-2 mb-4 border rounded-lg text-gray-700"
              type="text"
              value={ruleString}
              onChange={(e) => setRuleString(e.target.value)}
              placeholder="Edit rule string"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition duration-200"
            >
              Update Rule
            </button>
          </>
        )}
        {message && (
        <p className={`text-sm text-white -400 p-2 rounded-lg mt-4 ${!message.includes('successfully') ? 'bg-red-500' : 'bg-green-500'} font-medium`}>
          {message}
        </p>
      )}
      </form>

      
    </div>
  );
}

export default EditRule;
