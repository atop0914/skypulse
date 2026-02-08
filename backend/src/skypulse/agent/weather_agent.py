"""LangChain Weather Agent"""

from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from skypulse.core.config import settings
from skypulse.services.qweather_service import qweather_tool


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

    async def query(self, question: str) -> str:
        """查询天气"""
        result = await self.agent.ainvoke({"messages": [{"role": "user", "content": question}]})
        # 返回最后一条 assistant 的消息内容
        messages = result.get("messages", [])
        for msg in reversed(messages):
            # LangChain 消息使用 type 属性，值如 'ai', 'human', 'tool'
            if msg.type == "ai":
                return msg.content
        return str(result)
