---
---

<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const blogListing = frontmatter.value.blogListing || { rootArticles: [], categories: [] }

if (typeof window !== 'undefined' && frontmatter.value.firstArticleLink) {
  window.location.replace(frontmatter.value.firstArticleLink)
}
</script>

# 博客文章

这里是我所有的博客文章。

<div v-if="blogListing.rootArticles.length > 0" class="section">
  <h2>文章列表</h2>
  <ul>
    <li v-for="article in blogListing.rootArticles" :key="article.link">
      <a :href="article.link">{{ article.title }}</a>
    </li>
  </ul>
</div>

<div v-for="cat in blogListing.categories" :key="cat.dirName" class="section">
  <h2><a :href="cat.link">{{ cat.title }}</a></h2>

  <div v-for="sub in cat.subcategories" :key="sub.engName">
    <h3>{{ sub.title }} ({{ sub.articles.length }})</h3>
    <ul>
      <li v-for="article in sub.articles" :key="article.link">
        <a :href="article.link">{{ article.title }}</a>
      </li>
    </ul>
  </div>
</div>

<div v-if="blogListing.rootArticles.length === 0 && blogListing.categories.length === 0">
  <p>暂无文章</p>
</div>
