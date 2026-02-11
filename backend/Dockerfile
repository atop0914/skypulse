# 阶段 1: 引入 uv 官方二进制文件
FROM ghcr.io/astral-sh/uv:latest AS uv_bin

# 阶段 2: 运行环境
FROM python:3.12-slim

# 1. 设置工作目录
WORKDIR /app

# 2. 设置 uv 相关环境变量
ENV UV_COMPILE_BYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # 强制 uv 在 /app/.venv 创建虚拟环境，避免找不到家
    UV_PROJECT_ENVIRONMENT=/app/.venv

# 3. 安装基础工具 (用于健康检查和源管理)
RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list.d/debian.sources && \
    apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 4. 拷贝 uv 工具到系统路径
COPY --from=uv_bin /uv /uvx /bin/

# 5. 拷贝依赖描述文件
COPY pyproject.toml uv.lock* README.md* ./

# 6. 【构建缓存层】安装所有依赖
# --frozen 保证版本与 lock 文件严丝合缝
# --no-install-project 这一步先不安装代码，只装第三方包（加速用）
RUN uv sync --frozen --no-dev --no-install-project

# 7. 拷贝源代码
COPY src ./src

# 8. 【最后同步】安装项目本身
# 这一步会根据你的 pyproject.toml 把 src 里的代码注册到虚拟环境中
RUN uv sync --frozen --no-dev

# 9. 权限与用户设置
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

# 10. 声明端口
EXPOSE 8000

# 11. 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# 12. 【终极启动】完全模拟本地命令
# uv run 会自动识别 /app/.venv 并启动程序
# 使用 --no-sync 标志是为了防止容器启动时联网检查更新，实现秒开
CMD ["uv", "run", "--no-sync", "python", "-m", "skypulse.main"]