// src/components/EvaluateRule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function EvaluateRule() {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState('');
  const [userData, setUserData] = useState({});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rules/get-rules');
        setRules(response.data);
      } catch (error) {
        console.log(error);
        setError('Failed to fetch rules.');
      }
    };

    fetchRules();
  }, []);

  
  const handleEvaluate = async (e) => {
    e.preventDefault();
    setError('');  
    setResult('');
  
    try {
      const response = await axios.post('http://localhost:5000/api/rules/evaluate', {
        ruleString: selectedRule,
        userData,
      });
  
      console.log("Response:", response);
      console.log("Response Data:", response.data);
  
      setResult(`Evaluation Done Successfully, Result: ${response.data.result}`);
    } catch (error) {
      console.error("Evaluation Error:", error);
  
      // Check if there is a response from the backend with an error message
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Display the backend error message
      } else {
        setError('Failed to evaluate rule.'); // More accurate generic error message
      }
    }
  };
    

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md rounded-sm  p-6">
      <h2 className="text-xl font-bold mb-4">Evaluate Rule</h2>
      <form onSubmit={handleEvaluate}>
        <select
          className="border p-2 w-full mb-4"
          value={selectedRule}
          onChange={(e) => setSelectedRule(e.target.value)}
        >
          <option value="">Select a rule</option>
          {rules.map((rule) => (
            <option key={rule._id} value={rule.ruleString}>
              {rule.ruleString}
            </option>
          ))}
        </select>
        <input
          className="border p-2 w-full mb-4"
          type="text"
          name="age"
          onChange={(e) => setUserData({ ...userData, age: e.target.value })}
          placeholder="Enter user age"
        />
        <input
          className="border p-2 w-full mb-4"
          type="text"
          name="salary"
          onChange={(e) => setUserData({ ...userData, salary: e.target.value })}
          placeholder="Enter user salary"
        />
        <input
          className="border p-2 w-full mb-4"
          type="text"
          name="department"
          onChange={(e) => setUserData({ ...userData, department: e.target.value })}
          placeholder="Enter user department"
        />
        <input
          className="border p-2 w-full mb-4"
          type="text"
          name="experience"
          onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
          placeholder="Enter user experience"
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Evaluate Rule
        </button>
      </form>
      {result && <p className="bg-green-500 text-white p-2 rounded mt-4 text-grey">{result}</p>}
      {/* Display result or error */}
      {/* {result && <p>{result}</p>} */}
      {error && <p className="bg-red-500 text-white p-2 rounded mt-4 text-grey">{error}</p>}
    </div>
  );
};

export default EvaluateRule;
