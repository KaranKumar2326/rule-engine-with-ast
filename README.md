
```markdown
# Rule Engine with AST

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Description

`Rule Engine with AST` is a MERN stack-based application designed to determine user eligibility based on attributes such as age, department, income, and experience. The project uses an **Abstract Syntax Tree (AST)** structure to represent conditional rules, allowing for dynamic creation, combination, and modification of rules. The application features a simple frontend interface, an API for backend processing, and a MongoDB cloud database for data storage.

### Key Features

- Dynamic rule creation based on user-defined conditions.
- Rule combination using optimized strategies to avoid redundant checks.
- Evaluation of user eligibility based on JSON input against defined rules.
- Support for modifying existing rules within the AST.


```

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** and **npm**: Required for running the server and client.
- **MongoDB Atlas** (cloud database): This project connects to a MongoDB cloud database. Set up an account and get a connection string if you haven't done so already.

### Step-by-Step Guide

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/KaranKumar2326/rule-engine-with-ast.git
   cd rule-engine-with-ast
   ```

2. **Set Up Environment Variables**:

   Create a `.env` file in the root directory (if not present) with the following environment variables:

   ```plaintext
   MONGO_URI=<Your MongoDB connection string>
   Added string for less configuration. Will disavle it after evaluation.
   PORT=5000 (optional, if different)
   ```

3. **Install All Dependencies at Once**:

   You can install all dependencies for both `client` and `server` by running the following command from the root directory:

   ```bash
   npm install --prefix server && npm install --prefix client
   ```

   Alternatively, you can install dependencies individually as shown below.

4. **Install Server Dependencies Individually**:

   Navigate to the `server` directory and install backend dependencies:

   ```bash
   cd server
   npm install express mongoose body-parser cors dotenv nodemon
   ```

5. **Install Client Dependencies Individually**:

   Move to the `client` directory and install frontend dependencies:

   ```bash
   cd ../client
   npm install axios
   ```

6. **Run the Project**:

   - Start the server (from the `server` directory):

     ```bash
     npm start
     ```

   - Start the client (from the `client` directory):

     ```bash
     npm start
     ```

   By default:
   - The **client** runs on `http://localhost:3000`.
   - The **server** runs on `http://localhost:5000`.

### Dependencies

The project uses the following dependencies, with key packages for backend functionality and development convenience.

#### Backend Dependencies

- **express@4.21.1**: Web framework for creating and managing API routes.
- **mongoose@8.7.2**: MongoDB Object Data Modeling (ODM) library for handling data in MongoDB.
- **body-parser@1.20.3**: Middleware for parsing JSON data in request bodies.
- **cors@2.8.5**: Middleware to enable Cross-Origin Resource Sharing, allowing the frontend and backend to communicate smoothly.
- **dotenv@16.4.5**: Loads environment variables from a `.env` file, making it easy to configure MongoDB URIs, JWT secrets, and other sensitive data without hardcoding them.

#### Development Dependencies

- **nodemon@3.1.7**: Development tool that automatically restarts the server when files change, improving development efficiency.

#### Client Dependency

- **axios@1.7.7**: Promise-based HTTP client used to make API requests from the frontend (React) to the backend (Node/Express).

These dependencies are defined in the `package.json` files for the `server` and `client` directories. They can be installed automatically by running `npm install` in each directory.

## API Documentation

The project provides the following API endpoints:

1. **Create Rule**: Create a rule based on a string.
   - **Endpoint**: `POST /api/create`
   - **Request Body**:
     ```json
     {
       "rule_string": "(age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')"
     }
     ```
   - **Response**: Returns the AST structure for the rule.

2. **Get All Rules**: Retrieve all saved rules.
   - **Endpoint**: `GET /api/get-rules`
   - **Response**: A JSON array of rules, each containing a `ruleString` field.

3. **Combine Rules**: Combine multiple rules into a single AST.
   - **Endpoint**: `POST /api/combine`
   - **Request Body**:
     ```json
     {
       "rules": ["rule1", "rule2"]
     }
     ```
   - **Response**: Returns the combined AST root node.

4. **Evaluate Rule**: Evaluate if a user meets the defined rules based on input data.
   - **Endpoint**: `POST /api/evaluate`
   - **Request Body**:
     ```json
     {
       "data": {
         "age": 35,
         "department": "Sales",
         "salary": 60000,
         "experience": 3
       }
     }
     ```
   - **Response**: `true` if the user matches the rule, `false` otherwise.

5. **Update Rule**: Update an existing rule by its ID.
   - **Endpoint**: `PUT /api/update/:id`
   - **Request Body**:
     ```json
     {
       "rule_string": "(age > 30 AND department = 'Sales') OR (age < 40 AND department = 'Marketing')"
     }
     ```
   - **Response**: Returns the updated rule.

## Usage

1. **Creating and Combining Rules**:
   - Use the `create` API to create rules based on conditions.
   - Combine multiple rules into a single AST structure using the `combine` API.

2. **Evaluating User Eligibility**:
   - Pass user data in JSON format to the `evaluate` endpoint to check eligibility based on the combined rules.

## Example Use Cases

1. **Example Rule 1**: `((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)`

2. **Example Rule 2**: `((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)`

These rules can be tested against JSON user data to determine eligibility.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push your branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

```

This updated README includes all commands for installing dependencies. Let me know if you need further modifications!
