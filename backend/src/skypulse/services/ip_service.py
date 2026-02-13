"""IP 定位服务 - 根据 IP 获取用户城市"""

import json

import httpx


async def get_city_by_ip(client_ip: str = None) -> str | None:
    """
    根据 IP 地址获取城市名
    
    参数:
        client_ip: 客户端 IP 地址
        
    返回:
        城市名，如 "北京"，如果获取失败返回 None
    """
    print("=" * 80)
    print("🌍 IP 定位服务 - 开始")
    print("=" * 80)
    print(f"📍 接收到的 IP: {client_ip}")
    
    try:
        # 如果没有提供 IP，使用请求者的 IP
        if not client_ip:
            # 使用 ip-api.com 的免费 API（无需 API key）
            url = "http://ip-api.com/json/"
            print(f"🔗 未提供 IP，使用自动检测: {url}")
        else:
            # 查询指定 IP
            url = f"http://ip-api.com/json/{client_ip}"
            print(f"🔗 调用 IP 定位 API: {url}")
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
            data = response.json()
            
            print(f"📬 API 响应状态码: {response.status_code}")
            print(f"📬 API 响应内容: {json.dumps(data, ensure_ascii=False)}")
            
            if data.get("status") == "success":
                city = data.get("city")
                country = data.get("country")
                print(f"✅ IP 定位成功! 城市: {city}, 国家: {country}")
                print("=" * 80)
                return city
            else:
                print(f"❌ IP 定位失败: {data.get('message', '未知错误')}")
                print("=" * 80)
                return None
    except Exception as e:
        print(f"❌ IP 定位异常: {e}")
        print("=" * 80)
        return None
