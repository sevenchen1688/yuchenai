import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const SLUG_LENGTH = 12
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function toBase62(buf: Buffer, len: number): string {
  let num = 0n
  for (const b of buf) num = (num << 8n) | BigInt(b)
  const base = 62n
  let s = ''
  while (num > 0n) {
    s = BASE62[Number(num % base)] + s
    num /= base
  }
  return s.padStart(len, '0').slice(0, len)
}

function generateSlug(filename: string): string {
  const hash = createHash('md5').update(filename).digest()
  return toBase62(hash, SLUG_LENGTH)
}

export interface SlugMap {
  [slug: string]: string  // slug -> filename.md
}

function loadSlugs(dir: string): SlugMap {
  const p = join(dir, 'slugs.json')
  if (existsSync(p)) {
    try { return JSON.parse(readFileSync(p, 'utf-8')) } catch { /* ignore */ }
  }
  return {}
}

function saveSlugs(dir: string, slugs: SlugMap): void {
  writeFileSync(join(dir, 'slugs.json'), JSON.stringify(slugs, null, 2))
}

export function syncSlugs(dir: string): SlugMap {
  const slugs = loadSlugs(dir)
  let existing: string[] = []
  try {
    existing = readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'index.md')
  } catch { return slugs }

  for (const [slug, file] of Object.entries(slugs)) {
    if (!existing.includes(file)) delete slugs[slug]
  }

  const rev = new Map(Object.entries(slugs).map(([k, v]) => [v, k]))
  for (const f of existing) {
    if (!rev.has(f)) {
      slugs[generateSlug(f)] = f
    }
  }

  saveSlugs(dir, slugs)
  return slugs
}

export function getSlug(dir: string, filename: string): string {
  const slugs = syncSlugs(dir)
  for (const [slug, file] of Object.entries(slugs)) {
    if (file === filename) return slug
  }
  return generateSlug(filename)
}

/**
 * Walk blog/ recursively, build both rewrites (for VitePress routing)
 * and resolveMap (for Vite SSR module resolution fix).
 */
export function buildSlugConfig(docsDir: string): {
  rewrites: Record<string, string>
  resolveMap: Record<string, string>  // slug -> full absolute path to actual .md
} {
  const rewrites: Record<string, string> = {}
  const resolveMap: Record<string, string> = {}

  function walk(dir: string, urlPrefix: string) {
    if (!existsSync(dir)) return
    const slugs = syncSlugs(dir)

    for (const [slug, file] of Object.entries(slugs)) {
      const srcPath = `${urlPrefix}${file}`
      const urlPath = `${urlPrefix}${slug}`
      rewrites[srcPath] = `${urlPath}.md`
      resolveMap[slug] = join(dir, file)
    }

    let entries
    try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
        walk(join(dir, e.name), `${urlPrefix}${e.name}/`)
      }
    }
  }

  walk(join(docsDir, 'blog'), 'blog/')
  return { rewrites, resolveMap }
}
