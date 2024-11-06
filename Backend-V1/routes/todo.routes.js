// routes/todoRoutes.js

const express = require('express');
const router = express.Router();
const { getAllTodos, createTodo, updateTodo, deleteTodo, deleteAllTodos } = require('../controllers/todo.controller');

// Define the routes and bind them to controller functions
router.get('/', getAllTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.delete('/', deleteAllTodos);
module.exports = router;
