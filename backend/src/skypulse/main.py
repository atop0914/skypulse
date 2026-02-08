"""FastAPI 应用入口"""

from fastapi import FastAPI

app = FastAPI(
    title="Weather Bot API",
    description="基于 AI Agent 的智能天气助手",
    version="0.1.0"
)

# 注册路由
from skypulse.api.routes import router
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
    import uvicorn
    uvicorn.run(
        "skypulse.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )


if __name__ == "__main__":
    main()
