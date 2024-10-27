const mongoose = require('mongoose');

// Define the schema for storing rules
const RuleSchema = new mongoose.Schema({
  ruleString: { type: String, required: true },  // The original rule string
  astRoot: { type: Object, required: true }      // Store the entire AST directly as an object
});

// Create the Rule model
const Rule = mongoose.model('Rule', RuleSchema);

module.exports = { Rule };
