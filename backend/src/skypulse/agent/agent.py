"""LangChain Weather Agent"""

import re

from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

from skypulse.core.config import settings
from skypulse.services.qweather_service import qweather_tool


# 检测LLM是否需要城市（回复中包含这类关键词）
CITY_REQUIRED_PATTERNS = [
    "哪个城市", "哪个城市", "告诉", "城市名称", "城市吗", 
    "想查询哪个城市", "请告诉我", "请说", "请问您"
]


class WeatherAgent:
    """天气 Agent 封装"""

    def __init__(self, api_key: str = None, base_url: str = None, model: str = None):
        # 使用传入的配置或从 settings 读取
        self.api_key = api_key or settings.openrouter_api_key
        self.base_url = base_url or settings.openrouter_base_url
        self.model = model or settings.openrouter_model

        # 初始化 LLM（使用 OpenRouter 或其他兼容 OpenAI 的 API）
        self.llm = ChatOpenAI(
            model=self.model,
            base_url=self.base_url,
            api_key=self.api_key,
            temperature=0.7,
        )

        self.tools = [qweather_tool]

        self.agent = create_agent(
            model=self.llm,
            tools=self.tools,
            system_prompt="""
                你是一个专业的天气助手，专门帮助用户查询天气。
                工作流程：
                1. 当用户询问天气时，你必须首先从用户问题中提取城市名称
                2. 然后调用 qweather_tool 工具查询该城市的天气
                3. 根据工具返回的数据，用自然、友好的方式回答用户

                重要规则：
                - 如果用户询问的问题跟天气无关时，请你拒绝回答任何问题
                - 如果用户没有指定城市，先询问用户要查询哪个城市
                - 始终调用工具获取真实的天气数据，不要自己编造
                - 如果工具调用失败，向用户说明情况
                - 用中文回复，使用摄氏度表示温度
                当前日期信息可以帮助你理解用户的需求（如下雨、凉爽等）。
                """,
            debug=False,
        )

    def _need_city(self, response: str) -> bool:
        """检测回复是否表明需要城市"""
        for pattern in CITY_REQUIRED_PATTERNS:
            if pattern in response:
                return True
        return False

    async def query(self, question: str, get_city_by_ip=None) -> str:
        """查询天气（非流式）
        
        Args:
            question: 用户问题
            get_city_by_ip: 可选的同步回调函数，用于通过IP获取城市
        """
        # 第一次问LLM
        result = await self.agent.ainvoke({"messages": [{"role": "user", "content": question}]})
        
        # 获取LLM回复
        messages = result.get("messages", [])
        response = ""
        for msg in reversed(messages):
            if msg.type == "ai":
                response = msg.content
                break
        
        # 如果LLM没有要城市，且提供了get_city_by_ip回调，则尝试获取城市
        if self._need_city(response) and get_city_by_ip:
            # 获取城市
            city = get_city_by_ip()
            if city:
                print(f"🔍 通过IP获取到城市: {city}")
                # 把城市加到问题里，再问一次
                new_question = f"{city} {question}"
                result = await self.agent.ainvoke({"messages": [{"role": "user", "content": new_question}]})
                messages = result.get("messages", [])
                for msg in reversed(messages):
                    if msg.type == "ai":
                        return msg.content
                return str(result)
        
        return response

    async def stream_query(self, question: str):
        """流式查询天气 - 逐字输出，只返回AI文本回复"""
        from langchain_core.messages import HumanMessage, AIMessageChunk
        
        # 使用 LLM 的原生流式接口，结合 tool 调用
        # 首先让 agent 执行 tool 调用
        full_result = ""
        
        async for event in self.agent.astream(
            {"messages": [HumanMessage(content=question)]},
            stream_mode="messages"
        ):
            # messages 模式返回 (chunk, metadata) 元组
            if len(event) >= 1:
                chunk = event[0]
                # 只处理 AI 消息的增量内容
                if isinstance(chunk, AIMessageChunk):
                    content = chunk.content
                    if content:
                        # 过滤掉 JSON 格式的工具返回结果
                        stripped = content.strip()
                        if stripped.startswith('{') and stripped.endswith('}'):
                            continue
                        if stripped.startswith('[') and stripped.endswith(']'):
                            continue
                        # 输出内容
                        yield content
