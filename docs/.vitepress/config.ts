import { defineConfig } from 'vitepress'
import { resolve, relative, basename, join } from 'node:path'
import { statSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateSidebar, findFirstArticleLink, findFirstCategoryArticle, getArticleTitle } from './sidebar'
import { buildSlugConfig } from './slug'
import { generateBlogListing } from './blog-data'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')
const docsDir = resolve(__dirname, '..')
const slugConfig = buildSlugConfig(docsDir)

const slugToCleanPath: Record<string, string> = {}
for (const [slug, absPath] of Object.entries(slugConfig.resolveMap)) {
  const relPath = relative(docsDir, absPath).replace(/\\/g, '/').replace(/\.md$/, '')
  slugToCleanPath[slug] = relPath
}

function getAbsPathFromRelativePath(relativePath: string): string {
  const cleanPath = relativePath.replace(/\\/g, '/')
  
  for (const [slug, absPath] of Object.entries(slugConfig.resolveMap)) {
    const existingCleanPath = relative(docsDir, absPath).replace(/\\/g, '/').replace(/\.md$/, '')
    if (existingCleanPath === cleanPath) {
      return absPath
    }
  }
  
  const m = cleanPath.match(/\/([A-Za-z0-9]{12})$/)
  if (m && slugConfig.resolveMap[m[1]]) {
    return slugConfig.resolveMap[m[1]]
  }
  
  if (cleanPath.endsWith('.md')) {
    return resolve(docsDir, cleanPath)
  }
  return resolve(docsDir, cleanPath + '.md')
}

function getLatestArticles(limit: number = 10) {
  const articles: { title: string; url: string; date: number }[] = []
  for (const [slug, absPath] of Object.entries(slugConfig.resolveMap)) {
    try {
      const stat = statSync(absPath)
      const relPath = relative(docsDir, absPath).replace(/\\/g, '/')
      const urlPath = slugConfig.rewrites[relPath]
      if (urlPath) {
        articles.push({
          title: getArticleTitle(absPath),
          url: '/' + urlPath.replace(/\.md$/, ''),
          date: stat.birthtimeMs
        })
      }
    } catch { /* skip unreadable files */ }
  }
  articles.sort((a, b) => b.date - a.date)
  return articles.slice(0, limit)
}

const latestArticles = getLatestArticles(10)
const blogListingData = generateBlogListing(docsDir)
const firstArticleLink = findFirstCategoryArticle()

const blogNavLabels: Record<string, string> = {
  'ai-fundamentals': 'AI通识',
  'ai-thoughts': 'AI杂谈',
  'AI-Agent': 'AI Agent'
}

export default defineConfig({
  title: '雨辰AI工作坊',
  description: '个人技术博客',
  lang: 'zh-CN',

  lastUpdated: true,

  transformPageData(pageData) {
    pageData.title = pageData.title.replace(/^\d+\.\s*/, '')

    if (pageData.relativePath) {
      const absPath = getAbsPathFromRelativePath(pageData.relativePath)
      
      try {
        pageData.lastUpdated = statSync(absPath).mtimeMs
      } catch {}
    }

    if (pageData.relativePath === 'index.md') {
      pageData.frontmatter.latestArticles = latestArticles
      pageData.frontmatter.firstArticleLink = firstArticleLink
    }

    if (pageData.relativePath === 'blog/index.md') {
      pageData.frontmatter.blogListing = blogListingData
      pageData.frontmatter.firstArticleLink = firstArticleLink
    }
  },

  base: '/',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:title', content: '雨辰AI工作坊' }],
    ['meta', { property: 'og:description', content: '探索AI · 构建未来 — 个人技术博客，分享Java、AI Agent、大模型应用开发等内容' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://yuchenaitech.cn' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: '雨辰AI工作坊' }],
    ['meta', { name: 'twitter:description', content: '探索AI · 构建未来 — 个人技术博客' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap' }],
  ],

  rewrites: slugConfig.rewrites,

  markdown: {
    config: (md) => {
      md.core.ruler.push('strip_h1_prefix', (state) => {
        for (let i = 0; i < state.tokens.length; i++) {
          const token = state.tokens[i]
          if (token.type === 'heading_open' && token.tag === 'h1') {
            const inline = state.tokens[i + 1]
            if (inline && inline.type === 'inline') {
              inline.content = inline.content.replace(/^\d+\.\s*/, '')
              if (inline.children) {
                for (const child of inline.children) {
                  if (child.type === 'text') {
                    child.content = child.content.replace(/^\d+\.\s*/, '')
                    break
                  }
                }
              }
            }
          }
        }
      })
    }
  },

  ignoreDeadLinks: true,

  vite: {
    plugins: [
      {
        name: 'watch-blog-content',
        configureServer(server) {
          const blogDir = resolve(docsDir, 'blog')
          server.watcher.add(blogDir)
          server.watcher.on('all', (event, file) => {
            if (event === 'add' || event === 'unlink' || event === 'change') {
              if (file.startsWith(blogDir) && (file.endsWith('.md') || file.endsWith('.json'))) {
                server.restart()
              }
            }
          })
        }
      },
      {
        name: 'slug-resolve',
        resolveId(id) {
          const m = id.match(/\/([A-Za-z0-9]{12})\.md/)
          if (m) {
            const slug = m[1]
            const filePath = slugConfig.resolveMap[slug]
            if (filePath) {
              return filePath
            }
          }
        },
        configureServer(server) {
          const stack = (server.middlewares as any).stack
          stack.unshift({
            route: '',
            handle: (req: any, _res: any, next: any) => {
              const url: string = req.url || ''
              const pathname = url.replace(/[?#].*$/, '')
              const m = pathname.match(/\/([A-Za-z0-9]{12})$/)
              if (m) {
                const slug = m[1]
                const cleanPath = slugToCleanPath[slug]
                if (cleanPath) {
                  req.url = url.slice(0, m.index) + '/' + encodeURI(basename(cleanPath))
                  if (url.length > pathname.length) {
                    req.url += url.slice(pathname.length)
                  }
                }
              }
              next()
            }
          })
        }
      }
    ]
  },



  themeConfig: {
    outline: { label: '大纲' },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    nav: [
      { text: '首页', link: '/' },
      { text: blogNavLabels['ai-fundamentals'], link: findFirstArticleLink('ai-fundamentals') },
      { text: blogNavLabels['AI-Agent'], link: findFirstArticleLink('AI-Agent') },
      { text: blogNavLabels['ai-thoughts'], link: findFirstArticleLink('ai-thoughts') },
      { text: '关于', link: '/about' }
    ],

    search: {
      provider: 'local'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },

    sidebar: generateSidebar(blogNavLabels),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sevenchen1688/yuchenai' }
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: '© 2026 雨辰AI工作坊 | <img src="/beian.png" style="width:16px;height:16px;vertical-align:middle;margin-right:2px;display:inline;" /><a href="https://beian.mps.gov.cn/#/query/webSearch?code=44010602015939" rel="noreferrer" target="_blank">粤公网安备44010602015939号</a>'
    }
  }
})
