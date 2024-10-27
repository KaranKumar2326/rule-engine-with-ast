const express = require('express');
const router = express.Router();
const { Rule } = require('../models/rulesSchema');
const cors = require('cors');
const { createRule, combineRules, evaluateRule, updateRule } = require('../controllers/rulesController');


// app.use(cors());
// Create a new rule
router.post('/create', createRule);


// Get all rules
router.get('/get-rules', async (req, res) => {
    try {
      const rules = await Rule.find({}, { ruleString: 1 }); // Fetch only rule strings
      res.status(200).json(rules);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rules' });
    }
  });
  



// update the rules
router.put('/update/:id', updateRule);
// Combine multiple rules
router.post('/combine', combineRules);

// Evaluate a rule with user data
router.post('/evaluate', evaluateRule);

module.exports = router;
