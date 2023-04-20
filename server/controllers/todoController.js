const catchAsync = require("../utils/catchAsync");
const Todo = require("../models/todoModel");
const AppError = require("../utils/appError");

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

  const todo = Todo({ title, user: req.currentUser._id });
  await todo.save();
  req.currentUser.todos.push(todo._id);
  await req.currentUser.save();

  res.status(201).json({
    status: "success",
    data: todo,
  });
});

const completedTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const todo = await Todo.findOneAndUpdate(
    { _id: id },
    { completed: true },
    { new: true, runValidators: true }
  );

  if (!todo) {
    return next(new AppError("No todo found", 404));
  }

  res.status(200).json({
    status: "success",
    data: todo,
  });
});

const deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Todo.findByIdAndDelete({ _id: id });

  res.status(204).json({
    status: "success",
    message: "Todo deleted",
  });
});

module.exports = { getAllTodos, createTodo, completedTodo, deleteTodo };
