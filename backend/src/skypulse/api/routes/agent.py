"""REST API 路由"""

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse, JSONResponse

from skypulse.agent.agent import WeatherAgent
from skypulse.core.config import settings
from skypulse.models.schemas import ChatRequest, ChatResponse
from skypulse.services.ip_service import get_city_by_ip

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


@router.get("/ip")
async def get_client_ip(request: Request):
    """
    获取客户端 IP 地址
    
    优先返回：
    1. X-Forwarded-For 请求头（反向代理场景）
    2. 请求的客户端 IP
    """
    # 优先从 X-Forwarded-For 获取
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        ip = forwarded_for.split(",")[0].strip()
        return {"ip": ip, "source": "X-Forwarded-For"}
    
    # 其次使用客户端 IP
    if request.client:
        return {"ip": request.client.host, "source": "client"}
    
    return {"ip": None, "source": "unknown"}


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


async def get_user_message(request: ChatRequest, http_request: Request) -> str:
    """
    获取用户消息，如果没提供城市则自动获取当前城市
    优先使用前端传递的 IP，其次使用请求头中的 IP
    """
    message = request.message
    
    # 检查消息是否包含城市关键词
    city_keywords = ["北京", "上海", "广州", "深圳", "杭州", "南京", "成都", "重庆", 
                    "武汉", "西安", "苏州", "天津", "长沙", "郑州", "济南", "青岛",
                    "城市", "地点", "哪里", "哪个城市"]
    
    has_city = any(keyword in message for keyword in city_keywords)
    
    # 如果没有提到城市，自动获取用户 IP 对应的城市
    if not has_city:
        # 优先使用前端传递的 IP
        client_ip = request.ip
        
        # 如果没有前端传递的 IP，尝试从请求头获取
        if not client_ip:
            forwarded_for = http_request.headers.get("X-Forwarded-For")
            if forwarded_for:
                client_ip = forwarded_for.split(",")[0].strip()
            elif http_request.client:
                client_ip = http_request.client.host
        
        if client_ip:
            city = await get_city_by_ip(client_ip)
            if city:
                message = f"{city} {message}"
    
    return message


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest, http_request: Request):
    """
    流式聊天接口 - SSE 流式传输
    
    如果用户没有提供城市，会自动根据IP获取用户所在城市
    """
    # 处理消息，自动补充城市信息
    processed_message = await get_user_message(request, http_request)
    
    agent = get_agent()

    async def generate():
        """生成 SSE 事件流"""
        async for chunk in agent.stream_query(processed_message):
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
