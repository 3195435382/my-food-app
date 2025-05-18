# 食享 - 智能美食推荐平台

![应用截图](https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=food+recommendation+app+interface&sign=71dcf9696a49b6039c435211dcf59050)

一个基于React的美食推荐应用，提供外卖点餐和家常烹饪两种模式的智能推荐。

## 功能特性

- 两种推荐模式：外卖点餐和家常烹饪
- 智能筛选系统：根据过敏源、忌食条件和健康状况推荐
- 详细的菜品信息：包括营养数据、做法步骤等
- 响应式设计：适配各种设备屏幕

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router

## 安装与运行

1. 克隆仓库
```bash
git clone [仓库地址]
```

2. 安装依赖
```bash
pnpm install
# 或
npm install
```

3. 开发模式运行
```bash
pnpm dev
# 或
npm run dev
```

4. 构建生产版本
```bash
pnpm build
# 或
npm run build
```

## 部署

项目可以部署到任何支持静态文件的托管服务，如Vercel、Netlify或GitHub Pages。

### 部署到Vercel

1. 在Vercel控制台导入项目
2. 使用默认配置
3. 点击部署

### 部署到GitHub Pages

1. 运行构建命令
```bash
npm run build
```

2. 将dist目录内容推送到gh-pages分支
```bash
git subtree push --prefix dist origin gh-pages
```

## 贡献

欢迎提交Pull Request或Issue。

## 许可证

MIT
