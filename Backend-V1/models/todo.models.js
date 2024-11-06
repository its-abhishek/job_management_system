const mongoose = require('mongoose');

// Define a Todo schema
const todoSchema = new mongoose.Schema({
    company: { type: String, required: true },
    url: { type: String, required: true },
    website: { type: String, required: true },
    status: { type: String, require: true },
    applied: { type: Date, require: true },
    deadline: { type: Date, require: true },
});

// Create a Todo model
const Todo = mongoose.model('Task_Management', todoSchema);

// Exporting the Todo model to use it in controllers
module.exports = Todo;
