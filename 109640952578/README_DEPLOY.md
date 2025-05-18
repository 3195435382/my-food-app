# 🌟 小白式GitHub部署教程（图文版）

## 🎯 准备工作

### 1. 注册GitHub账号
- 访问 [GitHub官网](https://github.com/)
- 点击右上角"Sign up"按钮
- 填写用户名、邮箱和密码
- 完成邮箱验证

![注册GitHub账号](https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=github%20sign%20up%20page&sign=19fced20412d66b864a2b90a4a00ebe5)

### 2. 安装Git工具
- Windows用户：[下载Git for Windows](https://git-scm.com/download/win)
- Mac用户：使用Homebrew `brew install git` 或 [下载Git for Mac](https://git-scm.com/download/mac)
- Linux用户：`sudo apt install git` (Ubuntu/Debian)

安装完成后，在终端运行以下命令验证安装：
```bash
git --version
```

### 3. 配置Git用户信息
打开终端/命令行，运行：
```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub注册邮箱"
```

## 🏗️ 创建GitHub仓库

1. 登录GitHub后，点击右上角`+` → `New repository`
2. 填写仓库信息：
   - Repository name: 项目名称（如`my-food-app`）
   - Description: 项目描述（可选）
   - **重要**：不要勾选"Initialize this repository with a README"
3. 点击绿色`Create repository`按钮

![创建新仓库](https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=github%20create%20new%20repository%20page&sign=3bc725b18a1ba37fb4abf6b9b710dab2)

## 💻 本地项目设置

### 方法一：使用GitHub Desktop（推荐新手）
1. [下载GitHub Desktop](https://desktop.github.com/)
2. 安装后打开，登录你的GitHub账号
3. 点击"Add local repository"
4. 选择你的项目文件夹
5. 点击"Publish repository"

### 方法二：使用命令行
1. 打开终端，导航到项目目录：
```bash
cd /path/to/your/project
```
2. 初始化Git仓库：
```bash
git init
```
3. 添加所有文件到暂存区：
```bash
git add .
```
4. 提交初始版本：
```bash
git commit -m "初始提交"
```
5. 添加远程仓库（替换为你的仓库地址）：
```bash
git remote add origin https://github.com/你的用户名/仓库名.git
```
6. 推送代码：
```bash
git branch -M main
git push -u origin main
```

## 🔍 验证部署
1. 刷新你的GitHub仓库页面
2. 应该能看到所有项目文件
3. 如果提示输入凭证：
   - 用户名：你的GitHub用户名
   - 密码：使用[Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)代替密码

## 🌐 部署到GitHub Pages
1. 在仓库页面点击"Settings"
2. 左侧选择"Pages"
3. 在"Branch"下选择`main`分支
4. 点击"Save"
5. 等待几分钟，访问：`https://你的用户名.github.io/仓库名/`

![GitHub Pages设置](https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=github%20pages%20settings%20page&sign=f2cbc4bbf36283ecd6bb01e5cc6a4c05)

## 🆘 常见问题解决

### ❓ 推送时提示权限不足
```bash
remote: Permission to user/repo.git denied to user.
```
解决方法：
1. 检查远程仓库地址是否正确：
```bash
git remote -v
```
2. 确保你有该仓库的写入权限
3. 使用SSH方式替代HTTPS：
```bash
git remote set-url origin git@github.com:用户名/仓库名.git
```

### ❓ 文件太大无法推送
错误信息：
```bash
remote: error: File some-file is 120.00 MB; this exceeds GitHub's file size limit of 100.00 MB
```
解决方法：
1. 从提交中移除大文件：
```bash
git rm --cached 大文件路径
```
2. 添加到大文件忽略列表：
```bash
echo "大文件路径" >> .gitignore
```
3. 重新提交

### ❓ 推送失败有冲突
```bash
! [rejected]        main -> main (non-fast-forward)
```
解决方法：
1. 先拉取最新代码：
```bash
git pull origin main
```
2. 解决冲突后重新提交：
```bash
git add .
git commit -m "解决冲突"
git push
```

## 📌 小贴士
1. 每次修改后记得提交：
```bash
git add .
git commit -m "描述你的修改"
git push
```
2. 使用`.gitignore`文件排除不需要版本控制的文件（如node_modules）
3. 推荐使用[GitHub Desktop](https://desktop.github.com/)简化操作
4. 遇到问题可以查看[GitHub官方文档](https://docs.github.com/)

## 🎉 恭喜！
你的项目已成功部署到GitHub！现在可以：
- 分享项目链接给他人
- 继续开发并推送更新
- 使用GitHub Pages展示你的应用


