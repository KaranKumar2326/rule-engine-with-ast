// src/components/RuleForm.js
import React, { useState } from 'react';
import axios from 'axios';

function RuleForm() {
  const [ruleString, setRuleString] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:5000/api/rules/create', { ruleString });
      setMessage('Rule created successfully!');
    } catch (error) {
    
        if (error.response && error.response.data && error.response.data.error) {
                    setError(error.response.data.error); 
         } else {
                    setError('Failed to create rule.'); 
        }
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 shadow-md rounded-sm  p-6">
      <h2 className="text-xl font-bold mb-4">Create Rule</h2>
      <h5>Use AND OR to combine rules.
        Avoid using small operators like or or and.
      </h5>
      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full mb-4"
          type="text"
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
          placeholder="Enter rule (e.g., age > 30 AND salary < 50000)"
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Create Rule
        </button>
      </form>
      {message && <p className="bg-green-400 p-2 mt-4 text-white rounded text-700">{message}</p>}
      {error && <p className="bg-red-400 p-2 mt-4 text-white rounded text-500">{error}</p>}
    </div>
  );
}

export default RuleForm;
