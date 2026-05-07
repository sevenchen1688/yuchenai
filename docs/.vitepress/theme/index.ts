import { h, defineComponent, type PropType } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'

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
        const tagsHtml = (props.frontmatter && props.frontmatter.tagsHtml) || ''
        return h(DefaultTheme.Layout, {
          frontmatter: props.frontmatter
        }, {
          'doc-before': tagsHtml ? () => h('div', { innerHTML: tagsHtml }) : undefined
        })
      }
    }
  })
} satisfies Theme
