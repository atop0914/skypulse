"""REST API 路由"""

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

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
    获取客户端 IP 地址（调试用）
    正常情况下 IP 由 Nginx 通过 X-Real-IP 传递
    """
    # 优先从 X-Real-IP 获取（Nginx 传递的真实 IP）
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return {"ip": real_ip, "source": "X-Real-IP"}
    
    # 其次从 X-Forwarded-For 获取
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        ip = forwarded_for.split(",")[0].strip()
        return {"ip": ip, "source": "X-Forwarded-For"}
    
    # 最后使用客户端 IP
    if request.client:
        return {"ip": request.client.host, "source": "client"}
    
    return {"ip": None, "source": "unknown"}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    聊天接口 - 接收用户消息，调用天气 Agent 处理
    """
    # 获取 Agent 实例
    agent = get_agent()

    # 调用 Agent 处理用户消息
    response_text = await agent.query(request.message)

    # 返回响应
    return ChatResponse(response=response_text)


async def get_user_message(message: str, http_request: Request) -> tuple[str, str]:
    """
    获取用户消息，如果没提供城市则自动获取当前城市
    
    返回: (处理后的消息, 提示信息)
    """
    print()
    print("=" * 80)
    print("🔍 开始处理用户消息 - 自动城市识别")
    print("=" * 80)
    print(f"📝 原始用户消息: {message}")
    
    # 检查消息是否包含城市关键词
    city_keywords = ["北京", "上海", "广州", "深圳", "杭州", "南京", "成都", "重庆", 
                    "武汉", "西安", "苏州", "天津", "长沙", "郑州", "济南", "青岛",
                    "城市", "地点", "哪里", "哪个城市", "天气"]
    
    has_city = any(keyword in message for keyword in city_keywords)
    print(f"🔍 是否包含城市关键词: {has_city}")
    
    hint = ""
    
    # 如果没有提到城市，自动获取用户 IP 对应的城市
    if not has_city:
        client_ip = None
        ip_source = None
        
        # 1. 优先从 X-Real-IP 获取（Nginx 传递的真实 IP）
        real_ip = http_request.headers.get("X-Real-IP")
        if real_ip:
            client_ip = real_ip
            ip_source = "X-Real-IP"
            print(f"📍 从 X-Real-IP 获取到 IP: {client_ip}")
        
        # 2. 其次从 X-Forwarded-For 获取
        if not client_ip:
            forwarded_for = http_request.headers.get("X-Forwarded-For")
            if forwarded_for:
                client_ip = forwarded_for.split(",")[0].strip()
                ip_source = "X-Forwarded-For"
                print(f"📍 从 X-Forwarded-For 获取到 IP: {client_ip}")
        
        # 3. 最后使用客户端 IP
        if not client_ip and http_request.client:
            client_ip = http_request.client.host
            ip_source = "client"
            print(f"📍 从客户端获取到 IP: {client_ip}")
        
        print(f"📍 最终使用的 IP: {client_ip} (来源: {ip_source})")
        
        if client_ip:
            # 调用 IP 定位服务
            city, status = await get_city_by_ip(client_ip)
            
            if city:
                message = f"{city} {message}"
                print(f"✅ 已将城市添加到消息: {message}")
            else:
                # IP 定位失败（可能是内网 IP）
                hint = f"⚠️ 当前为内网访问模式，无法自动获取您所在城市。请在问题中直接说明您想查询的城市，例如：'上海天气怎么样？'"
                print(f"❌ {hint}")
        else:
            hint = "⚠️ 无法获取您的IP地址，请在问题中直接说明您想查询的城市。"
            print(f"❌ {hint}")
    else:
        print("✅ 用户消息已包含城市关键词，跳过自动城市识别")
    
    print("=" * 80)
    return message, hint


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest, http_request: Request):
    """
    流式聊天接口 - SSE 流式传输
    
    如果用户没有提供城市，会自动根据 Nginx 传递的真实 IP 获取用户所在城市
    """
    # 处理消息，自动补充城市信息
    processed_message, hint = await get_user_message(request.message, http_request)
    
    agent = get_agent()

    async def generate():
        """生成 SSE 事件流"""
        # 如果有提示，先发送提示
        if hint:
            yield f"data: {hint}\n\n"
        
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
