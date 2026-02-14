"""FastAPI 应用入口"""

import json
import time
from contextlib import asynccontextmanager
from datetime import datetime

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

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


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """日志中间件 - 记录所有请求的详细信息"""
    start_time = time.time()
    
    # 记录请求开始时间
    request_start = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    
    # 获取客户端 IP
    client_ip = request.client.host if request.client else "unknown"
    real_ip = request.headers.get("X-Real-IP", "N/A")
    forwarded_for = request.headers.get("X-Forwarded-For", "N/A")
    
    # 记录请求头（只记录关键 header）
    important_headers = {
        "X-Real-IP": real_ip,
        "X-Forwarded-For": forwarded_for,
        "Content-Type": request.headers.get("Content-Type", "N/A"),
        "User-Agent": request.headers.get("User-Agent", "N/A")[:50] + "..." if len(request.headers.get("User-Agent", "")) > 50 else request.headers.get("User-Agent", "N/A"),
    }
    
    # 尝试获取请求体
    request_body = {}
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.body()
            if body:
                request_body = json.loads(body.decode("utf-8"))
                # 隐藏敏感信息
                if "ip" in request_body:
                    request_body["ip"] = f"[隐藏:{request_body.get('ip')}]"
        except Exception:
            request_body = {"error": "无法解析请求体"}
    
    # 打印请求开始日志
    print()
    print("=" * 80)
    print(f"📥 请求开始 | {request_start}")
    print("=" * 80)
    print(f"🌐 方法: {request.method}")
    print(f"🔗 URL: {request.url}")
    print(f"👤 客户端IP: {client_ip}")
    print(f"📍 X-Real-IP: {real_ip}")
    print(f"🔄 X-Forwarded-For: {forwarded_for}")
    print(f"📋 请求头: {json.dumps(important_headers, ensure_ascii=False)}")
    print(f"📦 请求体: {json.dumps(request_body, ensure_ascii=False, indent=2)}")
    print("-" * 80)
    
    # 继续处理请求
    response = await call_next(request)
    
    # 计算耗时
    process_time = (time.time() - start_time) * 1000
    
    # 记录响应状态
    response_body = ""
    try:
        if hasattr(response, 'body') and response.headers.get("content-type", "").startswith("application/json"):
            response_body = response.body
            try:
                response_body = json.loads(response_body.decode("utf-8"))
                # 隐藏敏感信息
                if isinstance(response_body, dict) and "response" in response_body:
                    response_body["response"] = response_body["response"][:100] + "..." if len(response_body.get("response", "")) > 100 else response_body["response"]
            except Exception:
                response_body = {"error": "无法解析响应体"}
    except Exception:
        response_body = {"error": "无法获取响应体"}
    
    # 打印请求结束日志
    print(f"✅ 状态码: {response.status_code}")
    print(f"⏱️ 耗时: {process_time:.2f}ms")
    print(f"📦 响应体: {json.dumps(response_body, ensure_ascii=False, indent=2) if isinstance(response_body, dict) else response_body}")
    print("=" * 80)
    print()
    
    return response


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
