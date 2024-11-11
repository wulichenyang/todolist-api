const { getConnection } = require("../db");

// 获取所有类别
const getCategories = async (ctx) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM category");
    ctx.body = rows;
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Database query failed: ${err.message}`);
  }
};

// 创建类别
const createCategory = async (ctx) => {
  const { name } = ctx.request.body;
  try {
    const connection = await getConnection();
    const query = "INSERT INTO category (name) VALUES (?)";
    await connection.query(query, [name]);
    ctx.status = 201;
    ctx.body = { message: "Category created successfully!" };
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error creating category: ${err.message}`);
  }
};

// 更新类别
const updateCategory = async (ctx) => {
  const { id } = ctx.params;
  const { name } = ctx.request.body;

  // 检查至少有一个更新字段被提供
  if (name === undefined) {
    ctx.throw(400, "Field 'name' must be provided for update");
    return;
  }

  try {
    const connection = await getConnection();

    // 构建动态更新查询
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }

    // 添加 ID 到查询参数
    values.push(id);

    // 生成查询字符串
    const query = `UPDATE category SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      ctx.throw(404, "Category not found");
    }

    ctx.body = { message: "Category updated successfully!" };
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error updating category: ${err.message}`);
  }
};

// 删除类别
const deleteCategory = async (ctx) => {
  const { id } = ctx.params;
  try {
    const connection = await getConnection();
    const query = "DELETE FROM category WHERE id = ?";
    const [result] = await connection.query(query, [id]);
    if (result.affectedRows === 0) {
      ctx.throw(404, "Category not found");
    }
    ctx.body = { message: "Category deleted successfully!" };

    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error deleting category: ${err.message}`);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
