"""REST API 路由"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from skypulse.agent.agent import WeatherAgent
from skypulse.core.config import settings
from skypulse.models.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/v1", tags=["weather"])


def get_agent() -> WeatherAgent:
    """获取天气 Agent 实例（懒加载）"""
    if not hasattr(get_agent, "_instance"):
        # 从配置文件读取 API key 和 base_url
        get_agent._instance = WeatherAgent(
            api_key=settings.openrouter_api_key,
            base_url=settings.openrouter_base_url,
            model=settings.openrouter_model,
        )
    return get_agent._instance


@router.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "ok", "service": "skypulse"}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    聊天接口 - 接收用户消息，调用天气 Agent 处理

    参数:
        request: 包含用户消息的请求体

    返回:
        ChatResponse: Agent 处理后的响应结果
    """
    # 获取 Agent 实例
    agent = get_agent()

    # 调用 Agent 处理用户消息
    response_text = await agent.query(request.message)

    # 返回响应
    return ChatResponse(response=response_text)


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    流式聊天接口 - SSE 流式传输

    参数:
        request: 包含用户消息的请求体

    返回:
        StreamingResponse: SSE 流式响应
    """
    agent = get_agent()

    async def generate():
        """生成 SSE 事件流"""
        async for chunk in agent.stream_query(request.message):
            # SSE 格式: data: <内容>\n\n
            yield f"data: {chunk}\n\n"

        # 发送结束标记
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
