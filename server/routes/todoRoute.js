const express = require("express");
const { getAllTodos, createTodo } = require("../controllers/todoController");

const router = express.Router();

router.route("/").get(getAllTodos).post(createTodo);

module.exports = router;
