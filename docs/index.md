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
  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>'
    title: 技术文章
    details: 分享编程技术、框架使用、最佳实践等内容
  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>'
    title: 学习笔记
    details: 记录学习过程中的心得与总结
  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/></svg>'
    title: 项目经验
    details: 分享项目开发中的经验与教训
---

<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const latestArticles = frontmatter.value.latestArticles || []
</script>

## 我是雨辰

<div class="custom-section">
<ul class="custom-list">
<li>🐶 14 年毕业，12 年 Java 开发与技术管理经验，历任技术总监、Java 开发专家，具备从 0 到 1 搭建产品技术架构 + 带领团队交付大型商业项目的完整能力。</li>
<li>🚀 核心技术：精通 Java 核心与 Spring 全家桶（源码级理解），深耕微服务与 DDD 领域驱动设计；同时掌握工业级 AI 应用开发技术栈（Spring AI/LangChain/RAG/Agent），支持多模态接入与 LLM 应用可观测性建设。</li>
<li>🌱 干货：公众号『雨辰AI』</li>
<li>📝 博客：yuchenaitech.cn</li>
<li>💌 微信：yuchenai2035 - 备注来意</li>
</ul>
</div>

<!-- ## 从这里开始探索

这里记录我在编程语言（Java / Python）、AI 技术、以及项目实战中的学习与思考，希望能帮助你少走一些弯路。 -->

--- 

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


## 联系我 - 可加技术交流群

<div class="contact-section">
  <div class="qr-container">
    <div class="qr-item">
      <div class="qr-wrapper">
        <img src="/images/conchatme/wechatQcode.jpg" alt="公众号" class="qr-image" />
      </div>
      <span class="qr-label">公众号 · 雨辰AI</span>
    </div>
    <div class="qr-item">
      <div class="qr-wrapper">
        <img src="/images/conchatme/xiaohongshuQcode.jpg" alt="小红书" class="qr-image" />
      </div>
      <span class="qr-label">小红书 · 雨辰AI工作坊</span>
    </div>
    <div class="qr-item">
      <div class="qr-wrapper">
        <img src="/images/conchatme/PersonalQcode.jpg" alt="个人微信" class="qr-image" />
      </div>
      <span class="qr-label">个人微信 · yuchenai2035</span>
    </div>
  </div>
</div>

<style>
:root {
  --list-item-gap: 0.15em;
  --list-bullet-size: 5px;
  --list-bullet-color: var(--vp-c-text-2);
}

.custom-section {
  font-size: inherit;
}

.custom-list {
  display: flex !important;
  flex-direction: column !important;
  gap: var(--list-item-gap) !important;
  margin-top: 0 !important;
  padding-left: 1.25em !important;
}

.custom-list li {
  list-style-type: none !important;
  list-style: none !important;
  position: relative !important;
  padding-left: 0 !important;
  margin-bottom: 0 !important;
  line-height: inherit !important;
}

.custom-list li::marker {
  content: '' !important;
  display: none !important;
}

.custom-list li::before {
  content: '' !important;
  position: absolute !important;
  left: -1.25em !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: var(--list-bullet-size) !important;
  height: var(--list-bullet-size) !important;
  border-radius: 50% !important;
  border: 1px solid var(--list-bullet-color) !important;
  background-color: transparent !important;
}
</style>

<style scoped>
.latest-articles {
  display: flex;
  flex-direction: column;
  gap: var(--list-item-gap, 0.15em);
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
  width: var(--list-bullet-size, 5px);
  height: var(--list-bullet-size, 5px);
  border-radius: 50%;
  border: 1px solid var(--list-bullet-color, var(--vp-c-text-2));
  margin-top: 1px;
}
.article-title {
  font-weight: 500;
  color: var(--vp-c-brand);
}

.contact-section {
  margin-top: 1rem;
  margin-bottom: -2rem;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1;
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.qr-wrapper {
  width: 140px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.qr-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
  text-align: center;
}

:deep(.theme-default-content) {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

:deep(.VPFooter) {
  padding-top: 0 !important;
}
</style>
