const Koa = require("koa");
const Router = require("koa-router");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// 获取命令行参数
const args = process.argv.slice(2);
const envFileArg = args.find((arg) => arg.startsWith("--env-file="));
const envFilePath = envFileArg ? envFileArg.split("=")[1] : null;

// 使用 dotenv 加载指定的环境变量文件
if (envFilePath) {
  console.log('envFilePath', envFilePath)
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config(); // 默认加载 .env 文件
}

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3000;
const HOST = process.env.DB_HOST;

// 数据库配置
const dbConfig = {
  host: HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// 测试数据库连接
async function testDbConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database.");
    await connection.end();
  } catch (err) {
    console.error("Database connection failed:", err.stack);
  }
}

// 测试连接
testDbConnection();

// 处理 GET 请求
router.get("/todos", async (ctx) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SELECT * FROM todo");
    ctx.body = rows;
    await connection.end();
  } catch (err) {
    ctx.throw(500, "Database query failed");
  }
});

// 将路由应用到 Koa 中
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
