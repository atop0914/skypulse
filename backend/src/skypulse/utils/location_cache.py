"""城市名到 LocationID 的本地缓存模块"""

import sqlite3
from pathlib import Path
from typing import Optional

# 数据库文件路径
DATA_DIR = Path(__file__).parent.parent.parent.parent / "data"
DB_PATH = DATA_DIR / "location_cache.db"


def init_cache():
    """初始化缓存数据库"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS location_cache (
            city_name TEXT PRIMARY KEY,
            location_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def get_location_id(city_name: str) -> Optional[str]:
    """从缓存获取城市的 LocationID

    参数:
        city_name: 城市名称

    返回:
        LocationID，如果缓存未命中则返回 None
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT location_id FROM location_cache WHERE city_name = ?", (city_name,))
        result = cursor.fetchone()
        conn.close()

        if result:
            return result[0]
        return None
    except sqlite3.Error:
        return None


def save_location_id(city_name: str, location_id: str):
    """将城市名和 LocationID 存入缓存

    参数:
        city_name: 城市名称
        location_id: LocationID
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT OR REPLACE INTO location_cache (city_name, location_id)
            VALUES (?, ?)
        """,
            (city_name, location_id),
        )
        conn.commit()
        conn.close()
    except sqlite3.Error:
        pass  # 静默处理缓存写入失败
