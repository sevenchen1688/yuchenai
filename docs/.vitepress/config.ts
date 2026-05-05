import { defineConfig } from 'vitepress'
import { resolve, relative, basename } from 'node:path'
import { statSync } from 'node:fs'
import { generateSidebar, findFirstArticleLink, getArticleTitle } from './sidebar'
import { buildSlugConfig } from './slug'

const docsDir = resolve(__dirname, '..')
const slugConfig = buildSlugConfig(docsDir)

// Pre-compute: slug -> clean URL path (original filename without .md)
const slugToCleanPath: Record<string, string> = {}
for (const [slug, absPath] of Object.entries(slugConfig.resolveMap)) {
  const relPath = relative(docsDir, absPath).replace(/\\/g, '/').replace(/\.md$/, '')
  slugToCleanPath[slug] = relPath
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
          url: '/' + urlPath,
          date: stat.mtimeMs
        })
      }
    } catch { /* skip unreadable files */ }
  }
  articles.sort((a, b) => b.date - a.date)
  return articles.slice(0, limit)
}

const latestArticles = getLatestArticles(10)

export default defineConfig({
  title: '雨辰AI工作坊',
  description: '个人技术博客',
  lang: 'zh-CN',

  lastUpdated: true,

  transformPageData(pageData) {
    pageData.title = pageData.title.replace(/^\d+\.\s*/, '')

    if (pageData.relativePath) {
      try {
        const absPath = resolve(docsDir, pageData.relativePath)
        pageData.lastUpdated = statSync(absPath).mtimeMs
      } catch { /* skip unreadable files */ }
    }

    if (pageData.relativePath === 'index.md') {
      pageData.frontmatter.latestArticles = latestArticles
    }
  },

  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
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
          // Match slug.md imports from client-side pathToFile in dev mode
          // e.g. /blog/ai-fundamentals/basics/2T6u6aqtNvxN.md
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
          // Prepend middleware to intercept clean slug URLs BEFORE
          // VitePress's rewritesPlugin so the SPA fallback serves app shell
          // instead of Vite serving raw .md files.
          const stack = (server.middlewares as any).stack
          stack.unshift({
            route: '',
            handle: (req: any, _res: any, next: any) => {
              const url: string = req.url || ''
              const pathname = url.replace(/[?#].*$/, '')
              // Match clean slug URLs (without .md) e.g. /blog/.../2T6u6aqtNvxN
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
    logo: '/images/logo/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: 'AI通识', link: findFirstArticleLink('ai-fundamentals') },
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

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sevenchen1688/yuchenai' }
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: '© 2026 雨辰AI工作坊'
    }
  }
})
