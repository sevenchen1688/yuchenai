import { h, defineComponent, type PropType, onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { useData } from 'vitepress'
import ImageLightbox from './ImageLightbox.vue'
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
      const { frontmatter, page } = useData()

      const updateButton = () => {
        if (page.value.relativePath === 'index.md' && frontmatter.value.firstArticleLink) {
          setTimeout(() => {
            const buttons = document.querySelectorAll<HTMLAnchorElement>('.VPButton.medium.brand')
            buttons.forEach((btn) => {
              if (btn.textContent?.trim() === '开始阅读') {
                btn.href = frontmatter.value.firstArticleLink
              }
            })
          }, 100)
        }
      }

      onMounted(() => {
        updateButton()
      })

      watch(() => page.value.relativePath, () => {
        updateButton()
      })

      return () => [
        h(DefaultTheme.Layout, {
          frontmatter: props.frontmatter
        }),
        h(ImageLightbox)
      ]
    }
  })
} satisfies Theme
