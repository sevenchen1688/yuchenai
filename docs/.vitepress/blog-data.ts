import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { listArticles, readBlogConfig, getArticleTitle } from './sidebar'
import { getSlug } from './slug'

export interface ArticleItem {
  title: string
  link: string
}

export interface SubcategoryGroup {
  title: string
  engName: string
  articles: ArticleItem[]
}

export interface CategoryGroup {
  dirName: string
  title: string
  link: string
  subcategories: SubcategoryGroup[]
}

export interface BlogListing {
  rootArticles: ArticleItem[]
  categories: CategoryGroup[]
}

function getSubdirectories(dir: string): string[] {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .map(d => d.name)
      .sort()
  } catch {
    return []
  }
}

export function generateBlogListing(docsDir: string): BlogListing {
  const blogDir = join(docsDir, 'blog')
  const rootArticles: ArticleItem[] = []
  const categories: CategoryGroup[] = []

  // Root-level articles in blog/
  for (const file of listArticles(blogDir).sort()) {
    rootArticles.push({
      title: getArticleTitle(join(blogDir, file)),
      link: `/blog/${getSlug(blogDir, file)}`
    })
  }

  // Subdirectories (categories)
  for (const subdir of getSubdirectories(blogDir)) {
    const subdirPath = join(blogDir, subdir)
    const configs = readBlogConfig(subdir)

    const indexPath = join(subdirPath, 'index.md')
    const catTitle = (() => {
      const t = getArticleTitle(indexPath)
      return t !== 'index' ? t : subdir
    })()

    if (configs.length === 0) {
      // Flat directory — articles directly in this dir
      const articles: ArticleItem[] = []
      for (const file of listArticles(subdirPath).sort()) {
        articles.push({
          title: getArticleTitle(join(subdirPath, file)),
          link: `/blog/${subdir}/${getSlug(subdirPath, file)}`
        })
      }
      if (articles.length === 0) continue
      categories.push({
        dirName: subdir,
        title: catTitle,
        link: `/blog/${subdir}/`,
        subcategories: [{ title: catTitle, engName: subdir, articles }]
      })
      continue
    }

    const subcategories: SubcategoryGroup[] = []

    for (const { eng, chn } of configs) {
      const catDir = join(subdirPath, eng)
      if (!existsSync(catDir)) continue

      const articles: ArticleItem[] = []
      for (const file of listArticles(catDir).sort()) {
        articles.push({
          title: getArticleTitle(join(catDir, file)),
          link: `/blog/${subdir}/${eng}/${getSlug(catDir, file)}`
        })
      }

      subcategories.push({ title: chn, engName: eng, articles })
    }

    if (subcategories.length > 0) {
      categories.push({
        dirName: subdir,
        title: catTitle,
        link: `/blog/${subdir}/`,
        subcategories
      })
    }
  }

  return { rootArticles, categories }
}
