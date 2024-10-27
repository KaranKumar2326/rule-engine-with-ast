const { Rule } = require('../models/rulesSchema');
const { parseRuleToAST, combineASTs, evaluateAST, combine_rules } = require('../utils/astOperations');

// Create a rule from the rule string
const createRule = async (req, res) => {
  const { ruleString } = req.body;

  if (!ruleString) {
    return res.status(400).json({ error: 'Rule string is required' });
  }

  try {
    const ast = parseRuleToAST(ruleString);

    // Save rule and AST to MongoDB
    const newRule = new Rule({
      ruleString,  // Store original rule string
      astRoot: ast.astRoot,  // Store just the AST root
      isCombined: false,  // Mark it as an individual rule
      createdAt: new Date(),
      modifiedAt: new Date()
    });
    
    console.log(newRule);
    await newRule.save();
    
    res.status(200).json({ message: 'Rule created successfully', newRule });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });

  }
};


const combineRules = async (req, res) => {
  const { rules } = req.body;

  if (!rules || !Array.isArray(rules)) {
    return res.status(400).json({ error: 'Invalid rules input' });
  }

  try {
    // Combine the rules into a single AST using the new function
    const combinedAST = combine_rules(rules);

    // Create a combined rule string (for record-keeping)
    const combinedRuleString = rules.join(' AND ');  // Adjust this as per your combination logic

    // Save the combined rule in MongoDB
    const combinedRule = new Rule({
      ruleString: combinedRuleString,
      astRoot: combinedAST,
      isCombined: true,
      createdAt: new Date(),
      modifiedAt: new Date()
    });

    await combinedRule.save();
    
    res.status(200).json({ message: 'Rules combined and saved to DB', combinedRule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to combine and save rules' });
  }
};




// Update an existing rule by ID
const updateRule = async (req, res) => {
  const { id } = req.params; // Rule ID from the request URL
  const { ruleString } = req.body; // New rule string from the request body

  if (!ruleString) {
    return res.status(400).json({ error: 'Rule string is required' });
  }

  try {
    // Parse the new rule string to generate the AST
    const ast = parseRuleToAST(ruleString);

    // Find the rule by ID and update it
    const updatedRule = await Rule.findByIdAndUpdate(
      id,
      {
        ruleString,
        astRoot: ast.astRoot,
        modifiedAt: new Date(),
      },
      { new: true } // Returns the updated document
    );

    if (!updatedRule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    res.status(200).json({ message: 'Rule updated successfully', updatedRule });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const evaluateRule = async (req, res) => {
  const { ruleString, userData } = req.body;

  if (!ruleString || !userData) {
    return res.status(400).json({ error: 'Rule and user data are required' });
  }

  try {
    // Find the rule by ruleString and get the AST
    const rule = await Rule.findOne({ ruleString });
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    // Evaluate the rule's AST against user data
    const result = evaluateAST(rule.astRoot, userData);
    console.log(result);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to evaluate rule' });
  }
};

// Fetch all rules
const getRules = async (req, res) => {
  try {
    const rules = await Rule.find(); // Retrieves all rules from the database
    res.status(200).json(rules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve rules' });
  }
};

module.exports = { createRule, combineRules, evaluateRule, updateRule, getRules };


