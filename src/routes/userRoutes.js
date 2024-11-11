const Router = require("koa-router");
const userController = require("../controllers/userController");

const router = new Router({ prefix: "/users" });

router.get("/", userController.getUsers);
router.post("/", userController.createUser); // 创建用户
router.put("/:id", userController.updateUser); // 更新用户
router.delete("/:id", userController.deleteUser); // 删除用户

module.exports = router;