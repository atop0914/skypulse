"""辅助函数"""

import re
from typing import Any


def format_weather_data(data: dict) -> str:
    """格式化天气数据"""
    if not data:
        return "暂无天气数据"
    return str(data)


def validate_location(location: str) -> bool:
    """验证地点格式"""
    return bool(re.match(r"^[\u4e00-\u9fa5a-zA-Z0-9]+$", location))


def async_to_sync(func) -> Any:
    """异步转同步装饰器"""
    import asyncio

    def wrapper(*args, **kwargs):
        return asyncio.run(func(*args, **kwargs))

    return wrapper
