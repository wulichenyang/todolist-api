const errorHandler = async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    // 设置响应状态和消息
    ctx.status = err.status || 500;
    ctx.body = { message: err.message };

    // 打印错误信息到控制台
    console.error(err);
  }
};

module.exports = errorHandler;
