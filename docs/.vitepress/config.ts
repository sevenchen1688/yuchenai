import { defineConfig } from 'vitepress'
import { resolve, relative, basename, join } from 'node:path'
import { statSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateSidebar, findFirstArticleLink, findFirstCategoryArticle, getArticleTitle } from './sidebar'
import { buildSlugConfig } from './slug'
import { generateBlogListing } from './blog-data'
import { extractTags } from './auto-tags'

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
          url: '/' + urlPath,
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
  'ai-fundamentals': 'AI通识'
}

function generateTagsHtml(tags: { name: string; color: string }[]): string {
  if (tags.length === 0) return ''
  const tagsHtml = tags.map(tag =>
    `<span class="article-tag" style="background-color:${tag.color}20;color:${tag.color};border-color:${tag.color}50">${tag.name}</span>`
  ).join('')
  return `<div class="article-tags-container"><span class="article-tags-label">标签：</span><div class="article-tags">${tagsHtml}</div></div>`
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
    }

    if (pageData.relativePath === 'blog/index.md') {
      pageData.frontmatter.blogListing = blogListingData
      pageData.frontmatter.firstArticleLink = firstArticleLink
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
          const m = id.match(/\/([A-Za-z0-9]{12})\.md/)
          if (m) {
            const slug = m[1]
            const filePath = slugConfig.resolveMap[slug]
            if (filePath) {
              return filePath
            }
          }
        },
        load(id) {
          if (!id.endsWith('.md')) return
          if (!id.includes('/blog/')) return

          const absPath = resolve(docsDir, id.replace(/^.*\/docs\//, ''))
          if (!absPath.includes('/blog/ai-fundamentals/')) return

          try {
            let content = readFileSync(absPath, 'utf-8')
            const tags = extractTags(content)
            if (tags.length === 0) return

            const tagsHtml = tags.map(tag =>
              `<span class="article-tag" style="background-color:${tag.color}20;color:${tag.color};border-color:${tag.color}50">${tag.name}</span>`
            ).join('')
            const tagsContainer = `<div class="article-tags-container"><span class="article-tags-label">标签：</span><div class="article-tags">${tagsHtml}</div></div>\n\n`

            if (content.startsWith('#')) {
              content = tagsContainer + content
              console.log('[load] Modified, first 200 chars:', content.substring(0, 200))
              return content
            }
          } catch {}
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

  buildEnd() {
    const distDir = join(__dirname, 'dist')
    console.log('[buildEnd] distDir:', distDir)
    if (!existsSync(distDir)) {
      console.log('[buildEnd] dist dir does not exist')
      return
    }

    function processHtmlFile(filePath) {
      try {
        let content = readFileSync(filePath, 'utf-8')
        const slugMatch = filePath.match(/\/([A-Za-z0-9]{12})$/)
        if (!slugMatch) return
        
        const slug = slugMatch[1]
        const filePath2 = slugConfig.resolveMap[slug]
        if (!filePath2) return

        const mdContent = readFileSync(filePath2, 'utf-8')
        const tags = extractTags(mdContent)
        if (tags.length === 0) return

        const tagsHtml = tags.map(tag =>
          `<span class="article-tag" style="background-color:${tag.color}20;color:${tag.color};border-color:${tag.color}50">${tag.name}</span>`
        ).join('')
        const tagsContainer = `<div class="article-tags-container"><span class="article-tags-label">标签：</span><div class="article-tags">${tagsHtml}</div></div>`

        const h1Match = content.match(/<h1[^>]*>.*?<\/h1>/s)
        if (h1Match) {
          content = content.replace(h1Match[0], tagsContainer + h1Match[0])
          writeFileSync(filePath, content, 'utf-8')
          console.log('[buildEnd] Tags added to:', filePath)
        }
      } catch (e) {
        console.log('[buildEnd] Error:', e.message)
      }
    }

    function walkDir(dir) {
      try {
        const files = readdirSync(dir)
        for (const file of files) {
          const filePath = join(dir, file)
          if (file.endsWith('.html') || /^[A-Za-z0-9]{12}$/.test(file)) {
            processHtmlFile(filePath)
          } else if (!file.includes('.')) {
            walkDir(filePath)
          }
        }
      } catch (e) {
        console.log('[buildEnd] walkDir error:', e.message)
      }
    }

    walkDir(distDir)
  },

  themeConfig: {
    logo: '/images/logo/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: blogNavLabels['ai-fundamentals'], link: findFirstArticleLink('ai-fundamentals') },
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
      copyright: '© 2026 雨辰AI工作坊'
    }
  }
})
