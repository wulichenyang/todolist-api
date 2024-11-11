const { getConnection } = require("../db");

// 获取所有用户
const getUsers = async (ctx) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT * FROM user");
    ctx.body = rows;
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Database query failed: ${err.message}`);
  }
};

// 创建用户
const createUser = async (ctx) => {
  const { username, email, password, uniq_name } = ctx.request.body;

  try {
    const connection = await getConnection();
    const query =
      "INSERT INTO user (username, email, password, uniq_name) VALUES (?, ?, ?, ?)";
    await connection.query(query, [username, email, password, uniq_name]);
    ctx.status = 201;
    ctx.body = { message: "User created successfully!" };
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error creating user: ${err.message}`);
  }
};

// 更新用户
const updateUser = async (ctx) => {
  const { id } = ctx.params;
  const { username, email, password, uniq_name } = ctx.request.body;

  // 检查至少有一个更新字段被提供
  if (!username && !email && !password && !uniq_name) {
    ctx.throw(
      400,
      "At least one field (username, email, password, or uniq_name) must be provided for update"
    );
    return;
  }

  try {
    const connection = await getConnection();

    // 构建动态更新查询
    const fields = [];
    const values = [];

    if (username !== undefined) {
      fields.push("username = ?");
      values.push(username);
    }

    if (email !== undefined) {
      fields.push("email = ?");
      values.push(email);
    }

    if (password !== undefined) {
      fields.push("password = ?");
      values.push(password);
    }

    if (uniq_name !== undefined) {
      fields.push("uniq_name = ?");
      values.push(uniq_name);
    }

    // 添加 ID 到查询参数
    values.push(id);

    // 生成查询字符串
    const query = `UPDATE user SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await connection.query(query, values);

    if (result.affectedRows === 0) {
      ctx.throw(404, "User not found");
    }

    ctx.body = { message: "User updated successfully!" };
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error updating user: ${err.message}`);
  }
};

// 删除用户
const deleteUser = async (ctx) => {
  const { id } = ctx.params;

  try {
    const connection = await getConnection();
    const query = "DELETE FROM user WHERE id = ?";
    const [result] = await connection.query(query, [id]);

    if (result.affectedRows === 0) {
      ctx.throw(404, "User not found");
    }

    ctx.body = { message: "User deleted successfully!" };
    await connection.end();
  } catch (err) {
    ctx.throw(500, `Error deleting user: ${err.message}`);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
