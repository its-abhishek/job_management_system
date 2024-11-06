// controllers/todoController.js
const mongoose = require('mongoose');
const Todo = require('../models/todo.models');

// GET all todos
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find(); // Fetch all todos from the database
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
};

// POST a new todo
const createTodo = async (req, res) => {
  const { company, url, website, status, applied, deadline } = req.body;

  if (!company || !url || !website || !status || !applied || !deadline) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newTodo = new Todo({
      company,
      url,
      website,
      status,
      applied,
      deadline
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating todo', error: error.message });
  }
};

// PUT to update a todo
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { company, url, website, status, applied, deadline } = req.body;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update only provided fields
    todo.company = company || todo.company;
    todo.url = url || todo.url;
    todo.website = website || todo.website;
    todo.status = status || todo.status;
    todo.applied = applied || todo.applied;
    todo.deadline = deadline || todo.deadline;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating todo', error: error.message });
  }
};

// DELETE a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully', deletedTodo: todo });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting todo', error: error.message });
  }
};

// DELETE all todos
const deleteAllTodos = async (req, res) => {
  try {
    const result = await Todo.deleteMany({});

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No todos found to delete' });
    }

    res.status(200).json({ message: 'All todos deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting todos', error: error.message });
  }
};

module.exports = { getAllTodos, createTodo, updateTodo, deleteTodo, deleteAllTodos };