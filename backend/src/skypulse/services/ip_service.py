"""IP 定位服务 - 根据 IP 获取用户城市"""

import httpx


async def get_city_by_ip(client_ip: str = None) -> str | None:
    """
    根据 IP 地址获取城市名
    
    参数:
        client_ip: 客户端 IP 地址
        
    返回:
        城市名，如 "北京"，如果获取失败返回 None
    """
    try:
        # 如果没有提供 IP，使用请求者的 IP
        if not client_ip:
            # 使用 ip-api.com 的免费 API（无需 API key）
            url = "http://ip-api.com/json/"
        else:
            # 查询指定 IP
            url = f"http://ip-api.com/json/{client_ip}"
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
            data = response.json()
            
            if data.get("status") == "success":
                city = data.get("city")
                return city
            return None
    except Exception as e:
        print(f"IP 定位失败: {e}")
        return None
