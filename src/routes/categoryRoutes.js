const Router = require("koa-router");
const categoryController = require("../controllers/categoryController");

const router = new Router({ prefix: "/categories" });

router.get("/", categoryController.getCategories);
router.post("/", categoryController.createCategory); // 创建类别
router.put("/:id", categoryController.updateCategory); // 更新类别
router.delete("/:id", categoryController.deleteCategory); // 删除类别

module.exports = router;