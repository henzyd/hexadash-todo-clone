const express = require("express");
const {
  getAllTodos,
  createTodo,
  completedTodo,
} = require("../controllers/todoController");

const router = express.Router();

router.route("/").get(getAllTodos).post(createTodo);
router.route("/completed/:id").patch(completedTodo);

module.exports = router;
