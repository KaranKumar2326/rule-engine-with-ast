const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const rulesRoutes = require('./routes/rules');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// API routes
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true, // Allow credentials if necessary
}));

app.use('/api/rules', rulesRoutes);

const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
