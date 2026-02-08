"""核心模块

提供应用配置和提示词管理。
"""

from weather_agent.core.config import settings
from weather_agent.core.prompts import SYSTEM_PROMPT, create_weather_prompt

__all__ = ["settings", "SYSTEM_PROMPT", "create_weather_prompt"]
