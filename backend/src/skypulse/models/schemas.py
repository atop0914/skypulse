"""Pydantic 数据模型"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WeatherNow(BaseModel):
    """当前天气"""

    obsTime: str
    temp: str
    feelsLike: str
    text: str
    windDir: str
    windScale: str
    humidity: str


class WeatherForecast(BaseModel):
    """天气预报"""

    date: str
    textDay: str
    tempMax: str
    tempMin: str
    windDirDay: str
    windScaleDay: str


class WeatherResponse(BaseModel):
    """天气响应"""

    current: WeatherNow
    forecast: list[WeatherForecast]
    location: str
    updated_at: datetime = datetime.now()


class ChatRequest(BaseModel):
    """聊天请求"""

    message: str
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    """聊天响应"""

    response: str
    agent: str = "skypulse"
