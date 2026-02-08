"""提示词配置模块"""

from langchain_core.prompts import ChatPromptTemplate

SYSTEM_PROMPT = """你是一个专业的天气助手,能够回答用户关于天气的问题。
请根据提供的天气数据,用友好的方式回答用户的问题。"""


def create_weather_prompt() -> ChatPromptTemplate:
    """创建天气查询提示词模板"""
    prompt = ChatPromptTemplate.from_messages([("system", SYSTEM_PROMPT), ("human", "{input}")])
    return prompt
