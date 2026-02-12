# 🌤️ SkyPulse Frontend

SkyPulse 智能天气机器人的 React 前端应用，提供现代化的天气查询界面。

## ✨ 特性

- 🎨 **现代 UI 设计** - 渐变色彩、流畅动画、毛玻璃效果
- 🌙 **暗色模式** - 自动适配系统主题
- 📱 **响应式设计** - 完美支持桌面端和移动端
- ⚡ **快速响应** - Vite 极速构建
- 🔧 **TypeScript** - 类型安全

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建工具 | Vite 5 |
| 状态管理 | Zustand |
| 样式 | Tailwind CSS |
| 动画 | CSS Animations |
| API 请求 | Axios |

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/          # UI 组件
│   │   ├── Header.tsx      # 顶部导航栏
│   │   ├── ChatWindow.tsx   # 聊天窗口
│   │   ├── ChatInput.tsx    # 输入区域
│   │   ├── MessageBubble.tsx # 消息气泡
│   │   └── WeatherCard.tsx  # 天气卡片
│   │
│   ├── contexts/           # React Context
│   │   └── ThemeContext.tsx # 主题上下文
│   │
│   ├── store/              # 状态管理 (Zustand)
│   │   └── useChatStore.ts # 聊天状态
│   │
│   ├── pages/              # 页面组件
│   │   └── HomePage.tsx    # 首页
│   │
│   ├── services/           # API 服务
│   │   └── api.ts          # Axios 封装
│   │
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # 全局类型
│   │
│   ├── utils/              # 工具函数
│   │   └── formatters.ts   # 格式化工具
│   │
│   ├── App.tsx             # 应用入口
│   └── main.tsx            # 渲染入口
│
├── index.html              # HTML 模板
├── package.json
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 配置
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录

### 预览生产构建

```bash
npm run preview
```

## 📡 API 接口

前端通过 `/api/v1` 代理访问后端 API：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/chat` | POST | 发送消息，获取 AI 回复 |
| `/health` | GET | 健康检查 |

### 请求示例

```typescript
// 发送消息
POST /api/v1/chat
Content-Type: application/json

{
  "message": "北京天气怎么样？"
}

// 响应
{
  "response": "北京今天天气晴朗..."
}
```

## 🎨 组件说明

### ChatWindow
聊天窗口组件，负责显示消息列表和快捷问题入口。

**Props:**
```typescript
interface ChatWindowProps {
  onQuickQuestion?: (question: string) => void;  // 快捷问题回调
}
```

### ChatInput
消息输入组件，包含文本输入框和发送按钮。

**Props:**
```typescript
interface ChatInputProps {
  onSend: (message: string) => Promise<void>;    // 发送消息回调
  onQuickQuestion?: (question: string) => void;   // 快捷问题回调
}
```

### MessageBubble
消息气泡组件，根据角色（用户/助手）显示不同样式。

### WeatherCard
天气信息卡片，展示详细天气数据。

### Header
顶部导航栏，包含 Logo、主题切换按钮。

## 🎯 快捷问题

首页展示常用快捷问题卡片，点击后直接发送：

- ☀️ 北京天气
- 🌆 上海天气
- 🌧️ 今天下雨吗
- 🌡️ 广州温度
- ❄️ 哈尔滨冷不冷
- 🌴 三亚适合去吗

## 🌓 暗色模式

应用自动检测系统主题偏好：
- macOS: 跟随系统设置
- Windows: 跟随系统设置
- 手动切换: 点击右上角主题按钮

## 🔧 配置

### 环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=/api/v1
VITE_APP_TITLE=SkyPulse
```

### Tailwind 扩展

自定义颜色和动画在 `tailwind.config.js` 中配置：

```javascript
theme: {
  extend: {
    colors: {
      sky: { /* 天空色系 */ },
      aurora: { /* 极光色系 */ },
    },
    animation: {
      float: 'float 3s ease-in-out infinite',
      pulse-glow: 'pulse-glow 2s ease-in-out infinite',
      slide-up: 'slide-up 0.3s ease-out',
    },
  },
}
```

## 📦 构建产物

```
dist/
├── index.html
└── assets/
    ├── index-xxxxx.js   # JavaScript 主文件
    └── index-xxxxx.css   # 样式文件
```

部署时将 `dist/` 目录复制到 web 服务器或 CDN。

## 🐛 常见问题

### 1. 快捷问题点击无反应
确保 `HomePage.tsx` 已正确传递 `onQuickQuestion` 回调。

### 2. 消息不显示
检查后端返回字段名是否为 `response`（非 `reply`）。

### 3. 暗色模式不生效
确保浏览器支持 `prefers-color-scheme` 或使用支持的主题切换。

## 📝 更新日志

### v1.0.0 (2026-02-12)
- ✨ 全新 UI 设计
- 🎨 暗色模式支持
- 🚀 Vite 构建优化
- 📱 响应式布局
- 🔧 TypeScript 重构

## 📄 许可证

MIT License
