// src/components/CombineRules.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CombineRules() {
  const [rules, setRules] = useState([]);             // All available rules from the backend
  const [selectedRules, setSelectedRules] = useState([]); // Rules selected for combination
       
  const [customRules, setCustomRules] = useState(['']); // Custom rule inputs
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

  // Handle adding additional custom rule fields
  const handleAddCustomRule = () => {
    setCustomRules([...customRules, '']);
  };

  // Handle changes in custom rule inputs
  const handleCustomRuleChange = (index, value) => {
    const updatedCustomRules = [...customRules];
    updatedCustomRules[index] = value;
    setCustomRules(updatedCustomRules);
  };

  // Handle combining selected rules and custom rules
  const handleCombine = async (e) => {
    e.preventDefault();
    const combinedRules = [...selectedRules, ...customRules.filter(rule => rule)];
    try {
      const response = await axios.post('/api/rules/combine', { rules: combinedRules });
      setMessage('Rules combined successfully!');
      console.log('Combined result:', response.data);
    } catch (error) {
      setMessage('Failed to combine rules.');
    }
  };

  

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md rounded-sm p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Combine Rules</h2>
      
      {/* Form for combining selected and custom rules */}
      <form onSubmit={handleCombine} className="mb-6">
        <label className="block text-white w-1/4 mb-2">Select Existing Rules to Combine</label>
        <select onChange={handleSelectRule} className="block w-full p-2 rounded mb-4">
          <option value="">Choose a rule to add</option>
          {rules.map((rule) => (
            <option key={rule._id} value={rule.ruleString}>{rule.ruleString}</option>
          ))}
        </select>

        {/* Display selected rules */}
        <div className="mb-4">
          <p className="font-semibold  text-white mb-2">Selected Rules for Combination:</p>
          {selectedRules.map((rule, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded mb-2">
              {rule}
            </div>
          ))}
        </div>

        {/* Custom Rule Inputs */}
        <div className="mb-4">
          <p className="font-semibold text-white mb-2">Add Custom Rules:</p>
          {customRules.map((customRule, index) => (
            <input
              key={index}
              type="text"
              value={customRule}
              onChange={(e) => handleCustomRuleChange(index, e.target.value)}
              placeholder={`Enter custom rule ${index + 1}`}
              className="block w-full p-2 border rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={handleAddCustomRule}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-2"
          >
            Add Another Rule
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Combine Selected Rules
        </button>
      </form>

     

      {/* Message Display */}
      {message && <p className="mt-4 text-yellow-200 font-semibold">{message}</p>}
    </div>
  );
}

export default CombineRules;
