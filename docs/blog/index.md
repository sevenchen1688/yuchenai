---
---

<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const blogListing = frontmatter.value.blogListing || { rootArticles: [], categories: [] }
</script>

# 博客文章

<div v-if="blogListing.rootArticles.length > 0" class="section">
  <h2>文章列表</h2>
  <ul class="article-tree">
    <li v-for="article in blogListing.rootArticles" :key="article.link">
      <a :href="article.link" class="article-link">{{ article.title }}</a>
    </li>
  </ul>
</div>

<div v-for="cat in blogListing.categories" :key="cat.dirName" class="section category-section">
  <h2 class="category-title"><a :href="cat.link">{{ cat.title }}</a></h2>

  <div v-for="sub in cat.subcategories" :key="sub.engName" class="subcategory">
    <h3 class="subcategory-title">{{ sub.title }} <span class="count">({{ sub.articles.length }})</span></h3>
    <ul class="article-tree">
      <li v-for="article in sub.articles" :key="article.link">
        <a :href="article.link" class="article-link">{{ article.title }}</a>
      </li>
    </ul>
  </div>
</div>

<div v-if="blogListing.rootArticles.length === 0 && blogListing.categories.length === 0">
  <p class="empty-state">暂无文章，敬请期待。</p>
</div>

<style scoped>
.section {
  margin-bottom: 2.5rem;
}

.category-section {
  padding-top: 1rem;
}

.category-title a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 700;
}

.category-title a:hover {
  text-decoration: underline;
}

.subcategory {
  margin-left: 0;
  margin-bottom: 1.5rem;
}

.subcategory-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.subcategory-title .count {
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.article-tree {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

.article-tree li {
  padding: 0;
  margin: 0;
  line-height: 1.8;
}

.article-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s, color 0.2s;
}

.article-link:hover {
  border-bottom-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-3);
}

.empty-state {
  color: var(--vp-c-text-3);
  text-align: center;
  padding: 3rem 0;
}
</style>
