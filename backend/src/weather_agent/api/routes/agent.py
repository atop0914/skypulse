"""REST API 路由"""

from fastapi import APIRouter
from weather_agent.models.schemas import ChatRequest, ChatResponse
from weather_agent.agent.weather_agent import WeatherAgent
from weather_agent.core.config import settings

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
    return {"status": "ok", "service": "weather_agent"}


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
