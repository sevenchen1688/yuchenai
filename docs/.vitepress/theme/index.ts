import { h, defineComponent, type PropType, computed, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { useData } from 'vitepress'
import './style.css'

const ArticleTags = defineComponent({
  name: 'ArticleTags',
  props: {
    frontmatter: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    }
  },
  setup(props) {
    const tagsHtml = computed(() => {
      return props.frontmatter?.tagsHtml || ''
    })

    return () => {
      if (!tagsHtml.value) return null
      return h('div', { innerHTML: tagsHtml.value })
    }
  }
})

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
    name: 'Layout',
    props: {
      frontmatter: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({})
      }
    },
    setup(props) {
      const { frontmatter, page } = useData()
      
      onMounted(() => {
        // 只在首页处理
        if (page.value.relativePath === 'index.md' && frontmatter.value.firstArticleLink) {
          // 找到 hero section 中的"开始阅读"按钮
          setTimeout(() => {
            const buttons = document.querySelectorAll('.VPButton.medium.brand')
            buttons.forEach((btn) => {
              const text = btn.textContent?.trim()
              if (text === '开始阅读') {
                (btn as HTMLAnchorElement).href = frontmatter.value.firstArticleLink
              }
            })
          }, 100)
        }
      })

      return () => {
        return h(DefaultTheme.Layout, {
          frontmatter: props.frontmatter
        }, {
          'doc-before': () => h(ArticleTags, { frontmatter: props.frontmatter })
        })
      }
    }
  }),
  enhanceApp({ app }) {
    app.component('ArticleTags', ArticleTags)
  }
} satisfies Theme
