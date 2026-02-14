"""IP 定位服务 - 根据 IP 获取用户城市"""

import json

import httpx


def is_private_ip(ip: str) -> bool:
    """
    检查是否为内网 IP
    
    内网 IP 范围：
    - 10.0.0.0/8
    - 172.16.0.0/12
    - 192.168.0.0/16
    - 127.0.0.0/8 (本地回环)
    """
    if not ip:
        return True
    
    # 检查回环地址
    if ip.startswith("127."):
        return True
    
    # 检查 10.x.x.x
    if ip.startswith("10."):
        return True
    
    # 检查 172.16.x.x - 172.31.x.x
    if ip.startswith("172."):
        parts = ip.split(".")
        if len(parts) >= 2:
            second = int(parts[1])
            if 16 <= second <= 31:
                return True
    
    # 检查 192.168.x.x
    if ip.startswith("192.168."):
        return True
    
    return False


async def get_public_ip() -> str | None:
    """获取当前公网IP"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # 使用 ipify 获取公网IP
            resp = await client.get("https://api.ipify.org?format=json")
            data = resp.json()
            return data.get("ip")
    except Exception as e:
        print(f"❌ 获取公网IP失败: {e}")
        return None


async def get_city_by_ip(client_ip: str = None) -> tuple[str | None, str]:
    """
    根据 IP 地址获取城市名
    
    参数:
        client_ip: 客户端 IP 地址（可选，不传则自动获取公网IP）
        
    返回:
        (城市名, 状态消息)
        - 成功时: ("北京", "成功消息")
        - 失败时: (None, "错误原因")
    """
    print("=" * 80)
    print("🌍 IP 定位服务 - 开始")
    print("=" * 80)
    
    # 如果没有提供 IP，自动获取公网IP
    if not client_ip:
        print("📍 未提供IP，自动获取公网IP...")
        client_ip = await get_public_ip()
        print(f"✅ 获取到公网IP: {client_ip}")
    
    if not client_ip:
        print("❌ 无法获取公网IP")
        print("=" * 80)
        return None, "无法获取公网IP"
    
    # 检查是否为内网IP（如果是内网IP，ip-api.com也可以返回当前出口IP的城市）
    # 所以这里不做内网检查，直接调用API
    
    print("=" * 80)
    print("🌍 IP 定位服务 - 开始")
    print("=" * 80)
    print(f"📍 接收到的 IP: {client_ip}")
    
    # 检查是否为内网 IP
    if is_private_ip(client_ip):
        print(f"⚠️ 检测到内网 IP: {client_ip}")
        print("=" * 80)
        return None, f"内网IP({client_ip})，无法自动获取城市"
    
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
                return city, f"成功"
            else:
                error_msg = data.get('message', '未知错误')
                print(f"❌ IP 定位失败: {error_msg}")
                print("=" * 80)
                return None, f"API错误: {error_msg}"
    except Exception as e:
        print(f"❌ IP 定位异常: {e}")
        print("=" * 80)
        return None, f"异常: {str(e)}"
