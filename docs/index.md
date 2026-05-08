---
layout: home

hero:
  name: 探索AI · 构建未来
  # text: 雨辰AI工作坊
  tagline: — 个人技术博客 —
  image:
    src: /images/logo/logo-large.png
    alt: 雨辰AI工作坊 Logo
    class: hero-logo-wrapper
  actions:
    - theme: brand
      text: 开始阅读
      link: /blog/
    - theme: alt
      text: 关于我
      link: /about

features:
  - icon: 📝
    title: 技术文章
    details: 分享编程技术、框架使用、最佳实践等内容
  - icon: 💡
    title: 学习笔记
    details: 记录学习过程中的心得与总结
  - icon: 🚀
    title: 项目经验
    details: 分享项目开发中的经验与教训
---

<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const latestArticles = frontmatter.value.latestArticles || []
</script>

## 我是雨辰

- 🐶 14 年毕业，12 年 Java 开发与技术管理经验，历任技术总监、Java 开发专家，具备从 0 到 1 搭建产品技术架构 + 带领团队交付大型商业项目的完整能力。

- 🚀 核心技术：精通 Java 核心与 Spring 全家桶（源码级理解），深耕微服务与 DDD 领域驱动设计；同时掌握工业级 AI 应用开发技术栈（Spring AI/LangChain/RAG/Agent），支持多模态接入与 LLM 应用可观测性建设。

- 🌱 干货：公众号『雨辰学 AI』
- 📝 博客：yuchenaitech.cn
- 💌 微信：yuchenai2035 - 备注来意

## 从这里开始探索

这里记录我在编程语言（Java / Python）、AI 技术、以及项目实战中的学习与思考，希望能帮助你少走一些弯路。

### 最新文章

<div v-if="latestArticles.length > 0" class="latest-articles">
  <a v-for="article in latestArticles" :key="article.url" :href="article.url" class="article-item">
    <span class="bullet"></span>
    <span class="article-title">{{ article.title }}</span>
  </a>
</div>
<div v-else>
  <p>暂无文章</p>
</div>

<style scoped>
.latest-articles {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  margin-top: 16px;
}
.article-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  text-decoration: none;
}
.bullet {
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-text-2);
  margin-top: 1px;
}
.article-title {
  font-weight: 500;
  color: var(--vp-c-brand);
}
</style>
