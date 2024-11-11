const Router = require("koa-router");
const todoController = require("../controllers/todoController");

const router = new Router({ prefix: "/todos" });

router.get("/", todoController.getTodos);
router.post("/", todoController.createTodo);
router.put("/:id", todoController.updateTodo); // 更新待办事项
router.delete("/:id", todoController.deleteTodo); // 删除待办事项

module.exports = router;