# 雨辰AI工作坊

基于 [VitePress](https://vitepress.dev/) 构建的个人技术博客，专注于人工智能领域知识分享。

## 技术栈

- **框架**: [VitePress](https://vitepress.dev/) v1.6.4
- **运行时**: Node.js 18+
- **语言**: TypeScript（配置）、Markdown（内容）、Vue 3（模板）
- **搜索**: MiniSearch（VitePress 内置本地搜索）
- **部署**: 静态站点，支持 GitHub Pages、Vercel、Netlify 等

## 功能特性

| 功能 | 说明 |
|------|------|
| 本地搜索 | 导航栏搜索框，基于 MiniSearch 全文索引 |
| 最后更新 | 文章底部显示文件修改时间（基于文件系统 mtime） |
| 干净 URL | 基于 MD5 + Base62 的短链接，避免中文文件名出现在 URL 中 |
| 标题去前缀 | 自动去除文章标题中的 `01.`、`02.` 等数字编号前缀 |
| 导航自动跳转 | 点击菜单直接打开板块第一篇（`01.` 开头）文章 |
| 首页最新文章 | 按修改时间倒序展示最新 10 篇文章 |
| 动态侧边栏 | 基于 `config.json` 自动生成分类侧边栏，含文章数量统计 |
| 明暗主题 | 适配 VitePress 默认明/暗主题切换 |
| 响应式布局 | VitePress 默认响应式设计 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览生产构建
npm run docs:preview
```

## 项目结构

```
YuChenAI/
├── docs/                              # 网站根目录
│   ├── .vitepress/
│   │   ├── config.ts                  # VitePress 核心配置
│   │   ├── sidebar.ts                 # 侧边栏生成 & 文章检索
│   │   ├── slug.ts                    # Slug 生成 & URL 重写
│   │   ├── blog-data.ts               # 博客列表数据结构
│   │   ├── theme/
│   │   │   ├── index.ts              # 主题入口
│   │   │   └── style.css             # 自定义样式
│   │   └── cache/                    # 开发缓存（gitignore）
│   ├── images/
│   │   └── logo/                     # Logo 图片
│   ├── blog/                         # 博客文章
│   │   ├── index.md                  # 博客列表页
│   │   ├── welcome.md                # 欢迎文章
│   │   ├── slugs.json                # 博客根文章 Slug 映射
│   │   └── ai-fundamentals/          # AI通识板块
│   │       ├── index.md              # 板块简介
│   │       ├── config.json           # 分类配置
│   │       ├── slugs.json
│   │       ├── basics/               # 基础概念（8篇）
│   │       │   ├── 01.AI发展70年：三次浪潮，两次寒冬.md
│   │       │   ├── 02.AI技术四象限分类.md
│   │       │   ├── 03.AI≠ML≠DL≠GenAI的真相，一张图说清楚.md
│   │       │   ├── 04.Transformer核心原理.md
│   │       │   ├── 05.普通人都应该懂的AI核心概念与底层原理.md
│   │       │   ├── 06.盘点国内外主流大模型.md
│   │       │   ├── 07.4B、8B、37B、70B到底是什么意思？.md
│   │       │   ├── 08.DeepSeek的稀疏注意力机制.md
│   │       │   └── slugs.json
│   │       └── principles/           # 核心原理（3篇）
│   │           ├── index.md
│   │           ├── neural-networks.md
│   │           ├── transformer.md
│   │           └── slugs.json
│   ├── index.md                      # 首页
│   └── about.md                      # 关于页
├── package.json
├── package-lock.json
└── .gitignore
```

## 内容组织

### 博客文章

所有文章放在 `docs/blog/` 目录下。支持两种组织方式：

1. **直接放在 `blog/` 根目录**：单篇文章，会出现在侧边栏 "博客文章" 分类下
2. **放在子目录中**（如 `blog/ai-fundamentals/`）：配合 `config.json` 实现多级分类

### 分类配置

子目录下的 `config.json` 定义分类结构：

```json
[
  {"basics": "基础概念"},
  {"principles": "核心原理"}
]
```

- key（如 `basics`）对应子目录名
- value（如 `基础概念`）为侧边栏显示的分类名，后跟文章数量

### 文章命名

文章文件名使用数字前缀 `01.`、`02.` 等进行排序，如：

```
01.AI发展70年：三次浪潮，两次寒冬.md
02.AI技术四象限分类.md
```

- 数字前缀控制文件排序和显示顺序
- 渲染时自动去除前缀，读者看不到编号

## Slug 短链接系统

为避免中文文件名出现在 URL 中，项目使用自定义 Slug 系统：

1. 对文件名取 MD5 哈希
2. 取哈希前 12 字符转为 Base62（`0-9A-Za-z`）
3. 生成长度恒定的短链接

**示例：**

| 文件名 | Slug | 最终 URL |
|--------|------|----------|
| `welcome.md` | `1MUzujYC1dFV` | `/blog/1MUzujYC1dFV` |
| `01.AI发展70年...md` | `2T6u6aqtNvxN` | `/blog/ai-fundamentals/basics/2T6u6aqtNvxN` |

Slug 映射持久化在每个目录的 `slugs.json` 文件中，构建时自动同步。

## 添加新内容

### 添加文章

1. 在对应目录创建 `.md` 文件（如 `docs/blog/ai-fundamentals/basics/09.新文章.md`）
2. 文件第一行为 `#` 标题
3. 重启开发服务器，Slug 自动生成

### 添加新分类

1. 在 `docs/blog/` 下创建子目录（如 `docs/blog/new-topic/`）
2. 添加 `config.json` 定义分类
3. 为每个分类创建对应子目录和 `index.md`

示例 `config.json`：
```json
[
  {"intro": "入门教程"},
  {"advanced": "进阶内容"}
]
```

### 添加顶级页面

1. 在 `docs/` 下创建 `.md` 文件（如 `docs/links.md`）
2. 在 `config.ts` 的 `themeConfig.nav` 中添加导航链接

### 在首页显示

新文章会自动出现在首页 "最新文章" 列表中（按文件修改时间倒序取前 10 篇）。

## 自定义配置

主要配置文件为 `docs/.vitepress/config.ts`：

| 配置项 | 位置 | 说明 |
|--------|------|------|
| 站点标题 | `title` | "雨辰AI工作坊" |
| 语言 | `lang` | `zh-CN` |
| 导航菜单 | `themeConfig.nav` | 首页、AI通识、关于 |
| 搜索 | `themeConfig.search` | `{ provider: 'local' }` |
| 最后更新 | `themeConfig.lastUpdated` | 格式化为中文日期 |
| GitHub 链接 | `themeConfig.socialLinks` | 导航栏 GitHub 图标 |
| 侧边栏 | `themeConfig.sidebar` | 由 `generateSidebar()` 动态生成 |

自定义样式在 `docs/.vitepress/theme/style.css` 中，主要包括首页 Hero 区域的 Logo 光晕效果和标题渐变色。

## 核心模块说明

### config.ts
- 站点全局配置、路由重写、Markdown 增强、主题配置
- 自定义 Vite 插件实现博客内容监听和 Slug 解析

### slug.ts
- 使用 MD5 + Base62 生成 12 位短 Slug
- 自动同步目录中的 Markdown 文件与 Slug 映射
- 构建路由重写表供 VitePress 使用

### sidebar.ts
- 自动扫描博客目录结构，生成侧边栏配置
- 解析 `config.json` 获取分类中英文名称
- 提取 Markdown 标题作为菜单项文本

### blog-data.ts
- 构建博客列表页面所需的数据结构
- 支持根级别文章和多级分类展示

## 部署

构建产物在 `docs/.vitepress/dist/`，可部署到任何静态托管服务。

```bash
npm run docs:build
# 上传 docs/.vitepress/dist/ 到托管服务
```

本站 GitHub 仓库：[https://github.com/sevenchen1688/yuchenai](https://github.com/sevenchen1688/yuchenai)

## 文章清单

### AI通识 - 基础概念（8篇）

1. AI发展70年：三次浪潮，两次寒冬
2. AI技术四象限分类
3. AI≠ML≠DL≠GenAI的真相，一张图说清楚
4. Transformer核心原理
5. 普通人都应该懂的AI核心概念与底层原理
6. 盘点国内外主流大模型
7. 4B、8B、37B、70B到底是什么意思？
8. DeepSeek的稀疏注意力机制

### AI通识 - 核心原理（3篇）

1. 神经网络基础
2. Transformer详解
3. 原理概述
