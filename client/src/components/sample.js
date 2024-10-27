// src/components/CombineRules.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CombineRules() {
  const [rules, setRules] = useState([]);            // All available rules from the backend
  const [selectedRules, setSelectedRules] = useState([]); // Rules selected for combination
  const [newRule, setNewRule] = useState('');        // Input for creating a new rule
  const [message, setMessage] = useState('');

  // Fetch all existing rules on component mount
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('/api/rules/get-rules');
        setRules(response.data);
      } catch (error) {
        console.error('Failed to fetch rules:', error);
        setMessage('Failed to fetch rules from the server.');
      }
    };
    fetchRules();
  }, []);

  // Handle adding selected rule from dropdown
  const handleSelectRule = (e) => {
    const selectedRule = e.target.value;
    if (selectedRule && !selectedRules.includes(selectedRule)) {
      setSelectedRules([...selectedRules, selectedRule]);
    }
  };

  // Handle combining selected rules
  const handleCombine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/rules/combine', { rules: selectedRules });
      setMessage('Rules combined successfully!');
      console.log('Combined result:', response.data);
    } catch (error) {
      setMessage('Failed to combine rules.');
    }
  };

  // Handle creating a new rule
  const handleCreateNewRule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/rules/create', { ruleString: newRule });
      setRules([...rules, response.data.newRule]);  // Add new rule to dropdown options
      setMessage('New rule created successfully!');
      setNewRule(''); // Clear input
    } catch (error) {
      setMessage('Failed to create new rule.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md rounded-sm p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Combine Rules</h2>
      
      {/* Select existing rules to combine */}
      <form onSubmit={handleCombine} className="mb-6">
        <label className="block text-white mb-2">Select Existing Rules to Combine</label>
        <select onChange={handleSelectRule} className="block w-full p-2 rounded mb-4">
          <option value="">Choose a rule to add</option>
          {rules.map((rule) => (
            <option key={rule._id} value={rule.ruleString}>{rule.ruleString}</option>
          ))}
        </select>

        {/* Display selected rules */}
        <div className="mb-4">
          <p className="font-semibold text-white mb-2">Selected Rules for Combination:</p>
          {selectedRules.map((rule, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded mb-2">
              {rule}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Combine Selected Rules
        </button>
      </form>

      {/* Form to create a new rule */}
      <form onSubmit={handleCreateNewRule} className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-white">Or, Create a New Rule</h3>
        <input
          type="text"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="Enter new rule (e.g., age > 30 AND salary < 50000)"
          className="block w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Create New Rule
        </button>
      </form>

      {/* Message Display */}
      {message && <p className="mt-4 text-yellow-200 font-semibold">{message}</p>}
    </div>
  );
}

export default CombineRules;
