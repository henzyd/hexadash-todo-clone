const catchAsync = require("../utils/catchAsync");
const Todo = require("../models/todoModel");

const getAllTodos = catchAsync(async (req, res, next) => {
  const todos = await Todo.find({ user: req.currentUser._id }).populate({
    path: "user",
    select: "username",
  });

  res.status(200).json({
    status: "success",
    results: todos.length,
    data: todos,
  });
});

const createTodo = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  console.log(req.currentUser);

  const todo = Todo({ title, user: req.currentUser._id });
  await todo.save();
  req.currentUser.todos.push(todo._id);
  await req.currentUser.save();

  res.status(201).json({
    status: "success",
    data: todo,
  });
});

module.exports = { getAllTodos, createTodo };
