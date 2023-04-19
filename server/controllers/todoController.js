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

  const todo = Todo.findOne({ id });

  if (!todo) {
    return next(new AppError("Todo not found", 404));
  }

  console.log(todo.completed);

  todo.completed = !todo.completed;
  await todo.save();

  res.status(200).json({
    status: "success",
    message: "Todo updated",
  });
});

module.exports = { getAllTodos, createTodo, completedTodo };
