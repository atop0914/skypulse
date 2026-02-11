"""FastAPI 应用入口"""

from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from skypulse.api.routes import router
from skypulse.utils.location_cache import init_cache


@asynccontextmanager
async def lifespan(app: FastAPI):
    """启动时初始化缓存数据库"""
    init_cache()
    yield


app = FastAPI(
    title="Weather Bot API",
    description="基于 AI Agent 的智能天气助手",
    version="0.1.0",
    lifespan=lifespan,
)

# 注册路由
app.include_router(router)


@app.get("/")
async def root():
    """根路径"""
    return {"message": "Weather Bot API", "docs": "/docs"}


@app.get("/health")
async def health():
    """健康检查"""
    return {"status": "ok"}


def main():
    """启动服务"""
    uvicorn.run("skypulse.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
