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
    await connection.query(query, [user_id, task, completed, category_id]);
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

  try {
    const connection = await getConnection();
    const query =
      "UPDATE todo SET task = ?, completed = ?, category_id = ? WHERE id = ?";
    const [result] = await connection.query(query, [
      task,
      completed,
      category_id,
      id,
    ]);

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
