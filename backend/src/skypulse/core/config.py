"""配置管理模块"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """应用配置"""

    # API Keys
    qweather_api_key: str = ""
    qweather_base_url: str = ""
    openrouter_api_key: str = ""
    openrouter_base_url: str = ""
    openrouter_model: str = ""

    # 应用配置
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
