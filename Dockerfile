# 使用 Node.js 官方镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 yarn.lock 文件
COPY package*.json ./

# 安装依赖
RUN yarn install

# 复制应用代码和环境配置文件
COPY . .

# 暴露应用端口
# EXPOSE 3000

# 启动应用
CMD ["node", "./src/index.js"]