const express = require("express");
const {
  getAllTodos,
  createTodo,
  completedTodo,
  deleteTodo,
} = require("../controllers/todoController");

const router = express.Router();

router.route("/").get(getAllTodos).post(createTodo);
router.route("/completed/:id").patch(completedTodo);
router.route("/delete/:id").delete(deleteTodo);

module.exports = router;
