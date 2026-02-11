# 🌪️ SkyPulse

智能天气机器人 - 基于 AI Agent 的天气查询应用

## 技术栈

- **后端**: Python + FastAPI + LangChain + 和风天气 API
- **前端**: React + TypeScript + Vite + Zustand
- **部署**: Docker + GitHub Actions

## 项目结构

```
skypulse/
├── backend/                    # Python 后端
│   ├── src/
│   │   └── skypulse/        # 主包
│   │       ├── __init__.py   # 包初始化
│   │       ├── main.py       # FastAPI 应用入口
│   │       ├── cli.py        # CLI 终端测试界面
│   │       ├── core/         # 配置和提示词
│   │       │   ├── config.py # 应用配置
│   │       │   └── prompts.py # 提示词模板
│   │       ├── models/       # 数据模型
│   │       │   └── schemas.py # Pydantic 模型
│   │       ├── services/     # API 服务
│   │       │   └── qweather_service.py # 和风天气 API
│   │       ├── agent/        # AI Agent
│   │       │   └── agent.py  # LangChain Agent
│   │       ├── api/         # REST API 路由
│   │       │   └── routes/   # FastAPI 路由
│   │       └── utils/       # 工具函数
│   │           ├── location_cache.py # 城市缓存
│   │           └── helpers.py        # 辅助函数
│   ├── README.md            # 后端详细文档
│   ├── pyproject.toml
│   └── uv.lock
│
└── frontend/                  # React 前端
    └── src/
        ├── components/      # UI 组件
        ├── contexts/        # Context 状态
        ├── store/          # Zustand 状态
        ├── pages/          # 页面
        ├── services/       # API 服务
        ├── types/          # TypeScript 类型
        └── utils/          # 工具函数
```

## 快速开始

### 后端

**启动 FastAPI 服务：**

```bash
cd backend
uv sync
uv run python -m skypulse.main
```

**或使用 CLI 终端测试界面：**

```bash
uv run python -m skypulse.cli
```

**或命令行工具：**

```bash
skypulse
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

## 文档

- [后端详细文档](backend/README.md)
