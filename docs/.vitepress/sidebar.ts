import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, basename, join } from 'node:path'
import { getSlug } from './slug'

const docsDir = resolve(__dirname, '..')

interface CategoryConfig {
  [engName: string]: string
}

export function getArticleTitle(mdPath: string): string {
  try {
    const content = readFileSync(mdPath, 'utf-8')
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim().replace(/^\d+\.\s*/, '') : basename(mdPath, '.md')
  } catch {
    return basename(mdPath, '.md')
  }
}

export function listArticles(absoluteDir: string): string[] {
  try {
    return readdirSync(absoluteDir).filter(f => f.endsWith('.md') && f !== 'index.md')
  } catch {
    return []
  }
}

export function readBlogConfig(subdir: string): { eng: string; chn: string }[] {
  const configPath = join(docsDir, 'blog', subdir, 'config.json')
  if (!existsSync(configPath)) return []
  try {
    const raw: CategoryConfig[] = JSON.parse(readFileSync(configPath, 'utf-8'))
    return raw.map(entry => {
      const [eng, chn] = Object.entries(entry)[0]
      return { eng, chn }
    })
  } catch {
    return []
  }
}

function buildSidebarForDir(subdir: string): any[] {
  const configs = readBlogConfig(subdir)
  const basePath = join(docsDir, 'blog', subdir)
  return configs.map(({ eng, chn }) => {
    const dir = join(basePath, eng)
    const files = listArticles(dir)
    return {
      text: `${chn}(${files.length})`,
      items: files.map(file => ({
        text: getArticleTitle(join(dir, file)),
        link: `/blog/${subdir}/${eng}/${getSlug(dir, file)}`
      }))
    }
  })
}

export function findFirstArticleLink(subdir?: string): string {
  const baseAbs = join(docsDir, 'blog', subdir || '')

  if (!subdir) {
    const files = listArticles(baseAbs).sort()
    const first01 = files.find(f => f.startsWith('01.'))
    const target = first01 || files[0]
    if (target) return `/blog/${getSlug(baseAbs, target)}`
    return '/blog/'
  }

  const configs = readBlogConfig(subdir)

  if (configs.length > 0) {
    const firstCategory = configs[0].eng
    const catDir = join(baseAbs, firstCategory)
    const files = listArticles(catDir).sort()
    const first01 = files.find(f => f.startsWith('01.'))
    const target = first01 || files[0]
    if (target) return `/blog/${subdir}/${firstCategory}/${getSlug(catDir, target)}`
    return `/blog/${subdir}/`
  }

  const files = listArticles(baseAbs).sort()
  const first01 = files.find(f => f.startsWith('01.'))
  const target = first01 || files[0]
  if (target) return `/blog/${subdir}/${getSlug(baseAbs, target)}`
  return `/blog/${subdir}/`
}

export function findFirstCategoryArticle(): string {
  const blogDir = join(docsDir, 'blog')
  let subdirs: string[]
  try {
    subdirs = readdirSync(blogDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort()
  } catch {
    return '/blog/'
  }

  for (const subdir of subdirs) {
    if (existsSync(join(blogDir, subdir, 'config.json'))) {
      return findFirstArticleLink(subdir)
    }
  }

  return '/blog/'
}

export function generateSidebar(navLabels: Record<string, string>): Record<string, any[]> {
  const sidebar: Record<string, any[]> = {
    '/blog/': [
      {
        text: '博客文章',
        items: [] as any[]
      }
    ]
  }

  // blog root articles (use slugs)
  let subdirs: string[]
  try {
    subdirs = readdirSync(join(docsDir, 'blog'), { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
  } catch {
    subdirs = []
  }

  for (const subdir of subdirs) {
    if (existsSync(join(docsDir, 'blog', subdir, 'config.json'))) {
      const subdirPath = join(docsDir, 'blog', subdir)
      const label = navLabels[subdir] || getArticleTitle(join(subdirPath, 'index.md'))
      sidebar['/blog/'].push({
        text: label,
        collapsed: false,
        items: buildSidebarForDir(subdir)
      })
    }
  }

  return sidebar
}
