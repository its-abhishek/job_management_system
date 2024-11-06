const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./routes/todo.routes');
const app = express();
const PORT = 3000;

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb+srv://todolist:12345@cluster0.zxggjjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(cors()); // Handle CORS if needed
app.use(express.json()); // Parse incoming JSON requests

// Use the todoRoutes for any `/api/todos` routes
app.use('/api/applications', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
