"""和风天气 API 封装"""

import httpx
import json as json_module
from langchain_core.tools import tool
from weather_agent.core.config import settings


class QWeatherService:
    """和风天气服务"""

    def __init__(self):
        self.api_key = settings.qweather_api_key
        self.base_url = settings.qweather_base_url

    def _get_auth_header(self) -> dict:
        """获取认证请求头"""
        return {"X-QW-Api-Key": self.api_key}

    async def get_location_id(self, city: str) -> str:
        """根据城市名称获取 LocationID

        参数:
            city: 城市名称，如 "北京"、"上海" 等

        返回:
            LocationID，如 "101010100"
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"{self.base_url}/geo/v2/city/lookup"
            params = {"location": city, "lang": "zh"}
            headers = self._get_auth_header()

            response = await client.get(url, params=params, headers=headers)

            if not response.text:
                raise ValueError(f"Geo API 返回空响应，请检查 API Key 和 URL 配置")

            try:
                data = response.json()
                if data.get("code") == "200" and data.get("location"):
                    return data["location"][0]["id"]
                raise ValueError(f"无法找到城市 {city} 的 LocationID: {data}")
            except json_module.JSONDecodeError as e:
                raise ValueError(f"Geo API 返回无效 JSON: {response.text}") from e

    async def get_current_weather(self, location_id: str) -> dict:
        """获取当前天气

        参数:
            location_id: 地区的 LocationID
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"{self.base_url}/v7/weather/now"
            headers = self._get_auth_header()
            params = {"location": location_id}

            response = await client.get(url, params=params, headers=headers)

            if not response.text:
                raise ValueError(f"Weather API 返回空响应")

            try:
                return response.json()
            except json_module.JSONDecodeError as e:
                raise ValueError(f"Weather API 返回无效 JSON: {response.text}") from e

    async def get_forecast(self, location_id: str, days: int = 3) -> dict:
        """获取天气预报

        参数:
            location_id: 地区的 LocationID
            days: 预报天数，可选 3 或 7
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"{self.base_url}/v7/weather/{days}d"
            headers = self._get_auth_header()
            params = {"location": location_id}

            response = await client.get(url, params=params, headers=headers)

            if not response.text:
                raise ValueError(f"Forecast API 返回空响应")

            try:
                return response.json()
            except json_module.JSONDecodeError as e:
                raise ValueError(f"Forecast API 返回无效 JSON: {response.text}") from e


qweather_service = QWeatherService()


@tool
async def qweather_tool(city: str) -> str:
    """获取指定城市的天气信息

    参数:
        city: 城市名称，如 "北京"、"上海"、"广州" 等（必填）

    返回:
        城市的当前天气和未来天气预报
    """
    import json

    # 先根据城市名称获取 LocationID
    location_id = await qweather_service.get_location_id(city)

    # 调用天气 API
    current = await qweather_service.get_current_weather(location_id)
    forecast = await qweather_service.get_forecast(location_id)

    result = {"city": city, "location_id": location_id, "current": current, "forecast": forecast}
    return json.dumps(result, ensure_ascii=False)
