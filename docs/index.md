---
layout: home

hero:
  name: 探索AI · 构建未来
  # text: 雨辰AI工作坊
  tagline: — 个人技术博客 —
  image:
    src: /images/logo/logo-large.png
    alt: 雨辰AI工作坊 Logo
  actions:
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
const firstArticleLink = frontmatter.value.firstArticleLink || '/blog/'
</script>

<div class="custom-actions">
  <a :href="firstArticleLink" class="action custom-brand">开始阅读</a>
</div>

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
.custom-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
}

.custom-actions .action {
  display: inline-block;
  padding: 0 24px;
  line-height: 48px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.custom-actions .custom-brand {
  background-color: var(--vp-c-brand);
  color: var(--vp-c-brand-contrast);
}

.custom-actions .custom-brand:hover {
  background-color: var(--vp-c-brand-hover);
}

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
