import { h, defineComponent, type PropType, computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
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
