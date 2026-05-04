# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal technical blog built with [VitePress](https://vitepress.dev/), a static site generator based on Vite and Vue. The blog is named "雨辰AI工作坊" (YuChenAI Workshop).

## Common Commands

- `npm run docs:dev` - Start development server (default: http://localhost:5173)
- `npm run docs:build` - Build for production
- `npm run docs:preview` - Preview production build locally

## Project Structure

```
YuChenAI/
├── docs/
│   ├── .vitepress/
│   │   └── config.ts      # VitePress configuration (site title, nav, sidebar, theme)
│   ├── images/
│   │   └── logo/          # Site logo files
│   ├── blog/              # Blog articles
│   │   ├── index.md       # Blog listing page
│   │   └── welcome.md     # Individual blog posts
│   ├── index.md           # Homepage (hero layout)
│   └── about.md           # About page
├── package.json
└── package-lock.json
```

## Architecture Notes

- Uses VitePress **default theme** - no custom components or theme overrides
- Configuration is centralized in `docs/.vitepress/config.ts`
- Content is written in Markdown with frontmatter for page layouts
- Static assets (images, logos) should be placed in `docs/images/` or subdirectories
- The `base` path is configured as `/` (root domain deployment)

## Content Organization

- **Homepage** (`docs/index.md`): Hero layout with features section
- **Blog** (`docs/blog/`): Articles are listed in `index.md`, individual posts are separate `.md` files
- **Sidebar**: Configured per-route, currently only `/blog/` has sidebar navigation
- **Navigation**: Top-level nav includes Home, Blog, and About links

## Adding New Content

1. **Blog post**: Create new `.md` file in `docs/blog/`, then add link to `docs/blog/index.md` and update `docs/.vitepress/config.ts` sidebar
2. **Static assets**: Add to `docs/images/` and reference with `/images/...` path
3. **New pages**: Create `.md` in `docs/` and add to nav/sidebar in config

## Key Files

- `docs/.vitepress/config.ts` - Single source of truth for site configuration (title, nav, sidebar, theme, social links)
