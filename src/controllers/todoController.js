const { getConnection } = require("../db");

const getTodos = async (ctx) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM todo");
    ctx.body = rows;
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Database query failed: ${err.message}`);
  }
};

// 创建待办事项
const createTodo = async (ctx) => {
  const { user_id, task, completed, category_id } = ctx.request.body;

  try {
    const connection = await getConnection();
    const query =
      "INSERT INTO todo (user_id, task, completed, category_id) VALUES (?, ?, ?, ?)";
    await connection.query(query, [
      user_id,
      task,
      completed ?? false,
      category_id,
    ]);
    ctx.status = 201;
    ctx.body = { message: "Todo created successfully!" };
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error creating todo: ${err.message}`);
  }
};

// 更新待办事项
const updateTodo = async (ctx) => {
  const { id } = ctx.params;
  const { task, completed, category_id } = ctx.request.body;

  if (!task && completed === undefined && !category_id) {
    ctx.throw(
      400,
      "At least one field (completed, task, or category_id) must be provided for update"
    );
    return;
  }

  try {
    const connection = await getConnection();

    // 构建动态更新查询
    const fields = [];
    const values = [];

    if (task !== undefined) {
      fields.push("task = ?");
      values.push(task);
    }

    if (completed !== undefined) {
      fields.push("completed = ?");
      values.push(completed);
    }

    if (category_id !== undefined) {
      fields.push("category_id = ?");
      values.push(category_id);
    }

    // 添加 ID 到查询参数
    values.push(id);

    // 生成查询字符串
    const query = `UPDATE todo SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      ctx.throw(404, "Todo not found");
    }

    ctx.body = { message: "Todo updated successfully!" };
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error updating todo: ${err.message}`);
  }
};

// 删除待办事项
const deleteTodo = async (ctx) => {
  const { id } = ctx.params;

  try {
    const connection = await getConnection();
    const query = "DELETE FROM todo WHERE id = ?";
    const [result] = await connection.query(query, [id]);

    if (result.affectedRows === 0) {
      ctx.throw(404, "Todo not found");
    }

    ctx.body = { message: "Todo deleted successfully!" };
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error deleting todo: ${err.message}`);
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
