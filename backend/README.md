# Weather Bot - LangChain 天气智能服务机器人

## 项目结构

```
backend/
├── src/
│   └── weather_agent/
│       ├── __init__.py              # 包初始化
│       ├── main.py                   # FastAPI 应用入口
│       ├── cli.py                    # CLI 终端测试界面
│       ├── core/                     # 核心模块
│       │   ├── __init__.py          # 导出配置和提示词
│       │   ├── config.py             # 应用配置（环境变量管理）
│       │   └── prompts.py            # 提示词模板
│       ├── models/                   # 数据模型
│       │   ├── __init__.py          # 导出所有 Pydantic 模型
│       │   └── schemas.py            # 数据模型定义
│       ├── services/                 # 服务层
│       │   ├── __init__.py          # 导出服务类
│       │   └── qweather_service.py   # 和风天气 API 封装
│       ├── agent/                     # Agent 模块
│       │   ├── __init__.py          # 导出 WeatherAgent
│       │   └── weather_agent.py      # LangChain 天气 Agent
│       ├── api/                      # API 层
│       │   ├── __init__.py          # 导出路由
│       │   └── routes/
│       │       ├── __init__.py      # 导出路由
│       │       └── agent.py         # REST API 端点
│       └── utils/                    # 工具函数
│           ├── __init__.py          # 导出辅助函数
│           └── helpers.py            # 通用函数
├── .env.example                      # 环境变量示例
├── .python-version                   # Python 版本
├── pyproject.toml                   # 项目配置
└── uv.lock                          # 依赖锁文件
```

## 模块职责

### core/ - 配置管理
- **config.py**: 使用 `pydantic-settings` 管理环境变量
- **prompts.py**: 定义系统提示词和创建提示词模板的函数

### models/ - 数据模型
- **schemas.py**: 使用 Pydantic 定义请求/响应的数据结构

### services/ - 外部服务集成
- **qweather_service.py**: 和风天气 API 的封装，包含天气查询工具函数

### agent/ - AI Agent
- **weather_agent.py**: 基于 LangChain 的天气查询 Agent

### api/ - REST API
- **routes/agent.py**: FastAPI 路由定义

### utils/ - 辅助工具
- **helpers.py**: 通用辅助函数

## 快速开始

### 1. 安装依赖

```bash
cd backend
uv sync
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 API 密钥。

### 3. 运行应用

```bash
uv run python -m weather_agent.main
```

或使用命令行工具：

```bash
weather-bot
```

## 技术栈

- **FastAPI**: Web 框架
- **LangChain**: LLM 应用框架
- **LangChain OpenAI**: OpenAI 集成
- **Pydantic**: 数据验证
- **pydantic-settings**: 环境变量管理

## 许可证

MIT
