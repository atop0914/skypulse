# Weather Bot

智能天气机器人 - 基于 AI Agent 的天气查询应用

## 技术栈

- **后端**: Python + FastAPI + LangChain + 和风天气 API
- **前端**: React + TypeScript + Vite + Zustand
- **部署**: Docker + GitHub Actions

## 项目结构

```
weather_bot/
├── backend/                    # Python 后端
│   ├── src/
│   │   └── weather_agent/    # 主包
│   │       ├── __init__.py  # 包初始化
│   │       ├── main.py       # FastAPI 入口
│   │       ├── cli.py        # CLI 终端测试界面
│   │       ├── core/         # 配置和提示词
│   │       ├── models/       # 数据模型
│   │       ├── services/     # API 服务
│   │       ├── agent/        # AI Agent
│   │       ├── api/          # REST API
│   │       └── utils/        # 工具函数
│   ├── README.md             # 后端详细文档
│   ├── pyproject.toml
│   └── uv.lock
│
└── frontend/                  # React 前端
    └── src/
        ├── components/       # UI 组件
        ├── contexts/         # Context 状态
        ├── store/            # Zustand 状态
        └── pages/            # 页面
```

## 快速开始

### 后端

```bash
cd backend
uv sync
uv run python -m weather_agent.main
```

或使用命令行工具：

```bash
weather-bot
```

后端详细文档请查看 [backend/README.md](backend/README.md)

### 前端

```bash
cd frontend
npm install
npm run dev
```

## 文档

- [后端详细文档](backend/README.md)
