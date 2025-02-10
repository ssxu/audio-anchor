# 音轨文踪 - 音视频转录播放器

一个基于 React 和 Nginx 的音视频转录播放器，支持音视频文件上传和实时转录播放。

## 功能特点

- 支持音视频文件上传
- 实时音视频转录
- 同步显示转录文本
- 支持大文件上传
- 响应式界面设计
- Docker 容器化部署

## 快速开始

### 使用 Docker 运行

1. 构建 Docker 镜像：

```bash
docker build -t audio-track-viewer .
```

2. 运行 Docker 容器：

```bash
docker run -d -p 80:80 -e RECOGN_API=http://your-api-url audio-track-viewer
```

### 环境变量

- `RECOGN_API`: 转录服务 API 地址

### 开发环境运行

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm start
```

3. 访问 http://localhost:3000

## 项目结构

```
├── public/                 # 静态资源
├── src/                    # 源代码
│   ├── components/        # React 组件
│   ├── services/          # 服务层
│   └── config/            # 配置文件
├── nginx.conf             # Nginx 配置
├── Dockerfile             # Docker 构建文件
└── docker-entrypoint.sh   # Docker 入口脚本
```

## 技术栈

- React 18
- Nginx
- Docker
- Node.js

## 开发环境要求

- Node.js 14+
- npm 6+
- Docker (可选)

## 生产环境部署

1. 构建生产版本：

```bash
npm run build
```

2. 使用 Docker 部署：

```bash
docker build -t audio-track-viewer .
docker run -d -p 80:80 -e RECOGN_API=http://your-api-url audio-track-viewer
```

## API 接口

转录服务 API 需要实现以下接口：

- `POST /`: 上传音视频文件并获取转录结果
  - 请求：音视频文件（multipart/form-data）
  - 响应：转录文本数据

响应格式示例：

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "line": 1,
      "start_time": 0,
      "end_time": 1000,
      "text": "转录文本内容"
    }
  ]
}
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 问题反馈

如有问题或建议，请提交 Issue。