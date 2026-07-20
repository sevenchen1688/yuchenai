<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="image-lightbox-overlay"
      :class="{ dragging: isDragging }"
      @click.self="close"
      @wheel.prevent="handleWheel"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <button class="lightbox-close" @click="close" aria-label="关闭">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      <div class="lightbox-image-wrapper" :style="{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }">
        <img
          :src="src"
          :alt="alt"
          class="lightbox-image"
          :style="{ transform: imageTransform }"
        />
      </div>
      <div class="lightbox-hint" v-if="scale <= 1">滚轮缩放 · 点击遮罩关闭</div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const src = ref('')
const alt = ref('')
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const dragOrigin = ref({ x: 0, y: 0 })

const imageTransform = computed(() =>
  `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`
)

function open(imgSrc: string, imgAlt: string = '') {
  src.value = imgSrc
  alt.value = imgAlt
  visible.value = true
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  document.body.style.overflow = 'hidden'
}

function close() {
  visible.value = false
  document.body.style.overflow = ''
  src.value = ''
  alt.value = ''
}

function handleWheel(e: WheelEvent) {
  if (!visible.value) return
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  scale.value = Math.min(Math.max(0.5, scale.value + delta), 5)
}

function handleMouseDown(e: MouseEvent) {
  if (scale.value <= 1) return
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  dragOrigin.value = { x: translateX.value, y: translateY.value }
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  translateX.value = dragOrigin.value.x + (e.clientX - dragStart.value.x)
  translateY.value = dragOrigin.value.y + (e.clientY - dragStart.value.y)
}

function handleMouseUp() {
  isDragging.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) {
    close()
  }
}

function handleImageClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG' && target.closest('.main')) {
    const img = target as HTMLImageElement
    open(img.src, img.alt)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleImageClick)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleImageClick)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.image-lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 1;
}
.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-image-wrapper {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  animation: zoomIn 0.25s ease;
  user-select: none;
  -webkit-user-drag: none;
  transition: transform 0.05s linear;
}

.lightbox-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  pointer-events: none;
  user-select: none;
}

.dragging {
  cursor: grabbing !important;
}

@keyframes zoomIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
