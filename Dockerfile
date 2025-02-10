# 构建阶段
FROM node:14 as build

# 设置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 复制nginx配置文件模板
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# 从构建阶段复制构建后的文件
COPY --from=build --chown=nginx:nginx /app/build/ /usr/share/nginx/html/


# 复制入口脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 设置入口点
ENTRYPOINT ["/docker-entrypoint.sh"] 