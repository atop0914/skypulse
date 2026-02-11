# --- 阶段 1: 编译阶段 ---
FROM node:20-slim AS build-stage

WORKDIR /app

# 利用缓存：先拷贝包管理文件
COPY package*.json ./
RUN npm install

# 拷贝源码并打包
COPY . .
# 注意：如果你使用的是 Vite，生成的文件夹通常是 dist
RUN npm run build

# --- 阶段 2: 运行阶段 (Nginx) ---
FROM nginx:stable-alpine

# 从编译阶段拷贝打包好的静态文件到 Nginx 目录
# 如果你的打包目录不是 dist (比如是 build)，请修改此处
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 拷贝自定义 Nginx 配置以支持单页应用 (SPA) 路由
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]