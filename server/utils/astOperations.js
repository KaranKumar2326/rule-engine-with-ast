const validAttributes = ['age', 'department', 'salary', 'experience',"AGE","DEPARTMENT","SALARY","EXPERIENCE"];  // Add valid attributes here

// Parse rule string into AST with error handling
const parseRuleToAST = (ruleString) => {
  // Tokenize the rule string to capture parentheses, operators, and operands
  const tokens = tokenize(ruleString);
  if (!tokens || tokens.length === 0) throw new Error('Invalid rule format');

  // Build the AST from the tokens
  const astRoot = buildAST(tokens);
  return {
    ruleString, // Include the original rule string
    astRoot,    // The AST we just built
  };
};

// Tokenizer function to split the rule string into meaningful tokens
const tokenize = (ruleString) => {
  const tokens = [];
  const regex = /\s*(AND|OR|\(|\))\s*/g;
  let lastIndex = 0;
  let match;
  // const normalizedRuleString = ruleString.replace(/\b(and|or)\b/gi, (match) => match.toUpperCase());

  while ((match = regex.exec(ruleString)) !== null) {
    if (match.index > lastIndex) {
      // Capture the operand between operators or parentheses
      tokens.push(ruleString.slice(lastIndex, match.index).trim());
    }
    tokens.push(match[1]); // The operator or parenthesis
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < ruleString.length) {
    // Capture any remaining operand at the end
    tokens.push(ruleString.slice(lastIndex).trim());
  }
  
  // Validate that there are no unbalanced parentheses
  const openParentheses = (ruleString.match(/\(/g) || []).length;
  const closeParentheses = (ruleString.match(/\)/g) || []).length;
  if (openParentheses !== closeParentheses) {
    throw new Error('Unbalanced parentheses in rule');
  }
  
  return tokens;
};

// Helper function to build the AST from tokens using recursive descent parsing
const buildAST = (tokens) => {
  let position = 0;

  function peek() {
    return tokens[position];
  }

  function consume() {
    return tokens[position++];
  }

  // Parse an expression, handling OR operators
  function parseExpression() {
    let node = parseTerm();
    while (peek() === 'OR' || peek() === 'or') {
      const operator = consume();
      const right = parseTerm();
      node = {
        type: 'operator',
        operator,
        left: node,
        right,
      };
    }
    return node;
  }

  // Parse a term, handling AND operators
  function parseTerm() {
    let node = parseFactor();
    while (peek() === 'AND' || peek() === 'and') {
      const operator = consume();
      const right = parseFactor();
      node = {
        type: 'operator',
        operator,
        left: node,
        right,
      };
    }
    return node;
  }

  // Parse a factor, handling parentheses and operands
  function parseFactor() {
    if (peek() === '(') {
      consume(); // Consume '('
      const node = parseExpression();
      if (consume() !== ')') {
        throw new Error('Expected closing parenthesis ")"');
      }
      return node;
    } else {
      // Validate the operand before creating the node
      const value = consume();
      validateOperand(value);
      return {
        type: 'operand',
        value,
      };
    }
  }

  return parseExpression();
};


const validateOperand = (operand) => {
  const [attribute, operator, value] = operand.split(/(>|<|=)/);  // Split by comparison operators

  if (!attribute || !operator || !value) {
    throw new Error(`Invalid operand format: ${operand}`);
  }

  const trimmedAttribute = attribute.trim();
  
  // Check if attribute is strictly one of the valid attributes in lowercase or uppercase
  if (!validAttributes.includes(trimmedAttribute)) {
    throw new Error(`Invalid attribute: ${attribute}. Only 'age', 'salary', 'experience', 'department' or their complete uppercase versions are allowed.`);
  }

  // Ensure the operator is valid
  if (!['>', '<', '='].includes(operator.trim())) {
    throw new Error(`Invalid operator: ${operator}. Only '>', '<', and '=' are allowed.`);
  }

  // Validate if the value is numeric for numeric attributes
  if (['age', 'salary', 'experience', 'AGE', 'SALARY', 'EXPERIENCE'].includes(trimmedAttribute) && isNaN(Number(value))) {
    throw new Error(`Invalid value for numeric attribute '${attribute}': ${value}`);
  }

  // Additional check to ensure the attribute is not being used as a numeric value
  if (isNaN(Number(value)) && !isNaN(Number(attribute))) {
    throw new Error(`Invalid value for attribute: ${value}`);
  }
};



// Combine multiple ASTs into a single AST and validate attributes
const combineASTs = (rules) => {
  const asts = rules.map(rule => {
    const parsedRule = parseRuleToAST(rule);  // Parse the rule string
    return parsedRule.astRoot;  // Only return the astRoot, not the whole object
  });

  const combinedAST = asts.reduce((acc, current) => {
    return {
      type: 'operator',
      operator: 'AND',  // Combine rules with AND
      left: acc,
      right: current
    };
  });

  return combinedAST;
};

// Function to evaluate the AST against user data
const evaluateAST = (ast, userData) => {
  if (ast.type === 'operator') {
    const leftResult = evaluateAST(ast.left, userData);  // Recursively evaluate the left node
    const rightResult = evaluateAST(ast.right, userData);  // Recursively evaluate the right node

    console.log(`Evaluating operator ${ast.operator}: Left = ${leftResult}, Right = ${rightResult}`);

    if (ast.operator === 'AND') {
      return leftResult && rightResult;  // Both must be true
    } else if (ast.operator === 'OR') {
      return leftResult || rightResult;  // Only one must be true
    }
  } else if (ast.type === 'operand') {
    const [attribute, operator, value] = ast.value.split(/(>|<|=)/);  // Split by operators
    const userValue = userData[attribute.trim()];

    if (!userValue) {
      console.log(`Missing user attribute: ${attribute}`);
      throw new Error(`Missing user attribute: ${attribute}`);
    }

    console.log(`Evaluating operand: ${attribute} ${operator} ${value}, User Value = ${userValue}`);

    switch (operator) {
      case '>':
        return userValue > Number(value);  // Compare greater than
      case '<':
        return userValue < Number(value);  // Compare less than
      case '=':
        return userValue.trim().toLowerCase() === value.replace(/['"]/g, '').trim().toLowerCase();  // Case-insensitive, trimmed comparison
      default:
        return false;
    }
  }
};



// Function to find the most frequent operator (AND/OR) among rule strings
function findMostFrequentOperator(rules) {
  const operatorCount = { AND: 0, OR: 0 };

  rules.forEach(rule => {
    const ruleString = typeof rule === 'string' ? rule : rule.ruleString;
    if (ruleString) {  // Ensure ruleString is valid
      const andCount = (ruleString.match(/AND/g) || []).length;
      const orCount = (ruleString.match(/OR/g) || []).length;

      operatorCount.AND += andCount;
      operatorCount.OR += orCount;
    }
  });

  return operatorCount.AND >= operatorCount.OR ? 'AND' : 'OR';
}

// Recursive function to combine AST nodes, using the specified operator
function combineASTNodes(asts, operator) {
  if (asts.length === 1) {
    return asts[0];
  }

  const left = asts.shift();
  const right = combineASTNodes(asts, operator);

  return {
    type: 'operator',
    operator,
    left,
    right,
  };
}

// Main function to combine multiple rule strings into a single AST
const combine_rules = (rules) => {
  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error("Invalid input: rules must be a non-empty array of rule strings.");
  }

  // Parse each rule to its AST
  const asts = rules.map(ruleString => {
    const parsedRule = parseRuleToAST(ruleString);
    return parsedRule ? parsedRule.astRoot : null;  // Extract only the AST root, null if parse fails
  }).filter(ast => ast !== null);  // Filter out any null ASTs

  if (asts.length === 0) {
    throw new Error("No valid rules to combine.");
  }

  // Determine the most common operator (AND or OR)
  const mostFrequentOperator = findMostFrequentOperator(rules);

  // Combine AST nodes using the most frequent operator
  const combinedASTRoot = combineASTNodes(asts, mostFrequentOperator);

  return combinedASTRoot;  // Return the root of the combined AST
};

// Export the function so it can be used in other modules
// module.exports = { combine_rules, findMostFrequentOperator, combineASTNodes };


// Export combine_rules so it can be used in other parts of the application
module.exports = { parseRuleToAST, combineASTs, evaluateAST, combine_rules };

// Export all functions
// module.exports = { parseRuleToAST, combineASTs, evaluateAST };
