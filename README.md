# 婚礼邀请函小程序

一个使用 Taro 框架开发的微信小程序婚礼邀请函应用。

## 项目介绍

这是一个基于 Taro 4.x 和 React 开发的微信小程序项目，用于创建和分享婚礼邀请函。项目采用现代化的开发技术栈，支持多端开发。

## 技术栈

- **框架**: Taro 4.x
- **前端**: React
- **样式**: Less
- **构建工具**: Vite
- **包管理**: npm
- **平台**: 微信小程序

## 项目结构

```
my-wedding-invite/
├── src/
│   ├── app.js                 # 应用入口文件
│   ├── app.config.js          # 应用配置文件
│   ├── app.less              # 全局样式文件
│   ├── index.html            # H5 入口文件
│   └── pages/
│       └── index/            # 首页
│           ├── index.jsx     # 页面组件
│           ├── index.less    # 页面样式
│           └── index.config.js # 页面配置
├── config/                   # 构建配置
├── project.config.json       # 微信小程序项目配置
└── package.json             # 项目依赖配置
```

## 开发指南

### 环境要求

- Node.js >= 20.11.1
- npm >= 10.2.4

### 安装依赖

```bash
npm install
```

### 开发命令

```bash
# 微信小程序开发
npm run dev:weapp

# H5 开发
npm run dev:h5

# 支付宝小程序开发
npm run dev:alipay

# 字节跳动小程序开发
npm run dev:tt

# 百度小程序开发
npm run dev:swan
```

### 构建命令

```bash
# 构建微信小程序
npm run build:weapp

# 构建 H5
npm run build:h5

# 构建支付宝小程序
npm run build:alipay

# 构建字节跳动小程序
npm run build:tt

# 构建百度小程序
npm run build:swan
```

## 功能特性

- 🎨 美观的婚礼邀请函界面设计
- 📱 响应式布局，适配不同屏幕尺寸
- 💕 温馨的粉色主题配色
- 📅 婚礼信息展示（日期、时间、地点）
- 👰 新人信息展示
- 🔘 交互按钮（确认参加、查看详情）

## 页面说明

### 首页 (pages/index)

- 显示婚礼邀请函的主要内容
- 包含新人信息、婚礼详情和操作按钮
- 采用卡片式布局，视觉效果优雅

## 开发说明

1. 项目使用 Taro 框架，支持一套代码多端运行
2. 样式使用 Less 预处理器，支持嵌套和变量
3. 组件使用 Taro 提供的跨端组件
4. 支持热重载，开发体验良好

## 部署说明

### 微信小程序部署

1. 运行 `npm run build:weapp` 构建项目
2. 使用微信开发者工具打开 `dist` 目录
3. 在微信开发者工具中上传代码
4. 在微信公众平台提交审核

### 其他平台部署

根据目标平台运行对应的构建命令，然后使用对应平台的开发者工具进行部署。

## 注意事项

- 确保 Node.js 版本符合要求
- 微信小程序需要配置正确的 AppID
- 开发时建议使用微信开发者工具进行调试

## 许可证

MIT License
