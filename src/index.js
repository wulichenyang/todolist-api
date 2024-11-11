const Koa = require("koa");
const dotenv = require("dotenv");
const bodyParser = require("koa-bodyparser");
// const cors = require('@koa/cors');
// const serve = require('koa-static');
// const session = require("koa-session");
const rateLimit = require("koa-ratelimit");
// const jwt = require('koa-jwt');
const logger = require("koa-logger");
const compress = require("koa-compress");
const helmet = require("koa-helmet");

const todoRoutes = require("./routes/todoRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");

const errorHandler = require("./middlewares/errorHandler"); // 引入错误处理中间件

// 获取命令行参数
const args = process.argv.slice(2);
const envFileArg = args.find((arg) => arg.startsWith("--env-file="));
const envFilePath = envFileArg ? envFileArg.split("=")[1] : null;

// 使用 dotenv 加载指定的环境变量文件
if (envFilePath) {
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config(); // 默认加载 .env 文件
}

const app = new Koa();

// 日志中间件
app.use(logger());

// CORS 中间件
// app.use(cors());

// Rate Limiting 中间件
app.use(
  rateLimit({
    driver: "memory",
    db: new Map(),
    duration: 60000, // 1 minute
    max: 100, // 每分钟限制 100 次请求
    message: "Too many requests, please try again later.",
  })
);
// 请求体解析中间件
app.use(bodyParser());
// 安全中间件
app.use(helmet());
// Gzip 压缩
app.use(compress());

// 静态文件服务
// app.use(serve('public'));

// Session 中间件
// app.keys = [process.env.SESSION_SECRET];
// app.use(session({}, app));

// JWT 示例
// app.use(jwt({ secret: process.env.JWT_SECRET }).unless({ path: [/^\/public/] }));

// 错误处理中间件
app.use(errorHandler); // 使用提取的错误处理中间件

// 路由中间件
app.use(todoRoutes.routes()).use(todoRoutes.allowedMethods());
app.use(categoryRoutes.routes()).use(categoryRoutes.allowedMethods());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());

const PORT = process.env.PORT || 3000;
const HOST = process.env.DB_HOST;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
