// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RuleForm from './components/RuleForm';
import CombineRules from './components/CombineRules';
import EvaluateRule from './components/EvaluateRule';
import EditRule from './components/EditRule';

function Navbar() {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex justify-around text-white">
        <li>
          <Link to="/create-rule" className="hover:text-indigo-950">Create Rule</Link>
        </li>
        <li>
          <Link to="/combine-rules" className="hover:text-indigo-950">Combine Rules</Link>
        </li>
        <li>
          <Link to="/evaluate-rule" className="hover:text-indigo-950">Evaluate Rule</Link>
        </li>
        <li>
          <Link to="/edit" className="hover:text-indigo-950">Edit Rule</Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/create-rule" element={<RuleForm />} />
            <Route path="/combine-rules" element={<CombineRules />} />
            <Route path="/evaluate-rule" element={<EvaluateRule />} />
            <Route path="/edit" element={<EditRule />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
