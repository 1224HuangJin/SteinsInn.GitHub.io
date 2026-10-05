<template>
  <div class="hw-layer" aria-hidden="true">
    <!-- ========== 全站通用：四角蛛网 ========== -->
    <img class="hw-web hw-web-tl" :src="web" alt="" />
    <img class="hw-web hw-web-tr" :src="web" alt="" />
    <img class="hw-web hw-web-bl" :src="web" alt="" />
    <img class="hw-web hw-web-br" :src="web" alt="" />

    <!-- ========== 全站通用：右上角幽灵 ========== -->
    <img class="hw-ghost" :src="ghost" alt="" />

    <!-- ========== 全站通用：周期性俯冲的蝙蝠 ========== -->
    <img class="hw-bat-dash" :src="batDash" alt="" />

    <!-- ========== 仅首页：粒子 + 南瓜 + 横飞蝙蝠 ========== -->
    <canvas ref="canvasRef" class="hw-canvas" v-show="isHome" />
    <img class="hw-pumpkin" :src="pumpkin" alt="" v-show="isHome" />
    <img class="hw-bat hw-bat-1" :src="bat" alt="" v-show="isHome" />
    <img class="hw-bat hw-bat-2" :src="bat" alt="" v-show="isHome" />
    <img class="hw-bat hw-bat-3" :src="bat" alt="" v-show="isHome" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

/* ---------------- 资源路径 ---------------- */
const web     = withBase('/halloween/spiderweb.webp')
const ghost   = withBase('/halloween/ghost.webp')
const pumpkin = withBase('/halloween/pumpkin.webp')
const bat     = withBase('/halloween/bat.webp')
const batDash = withBase('/halloween/bat-dash.webp')

/* ---------------- 是否首页 ---------------- */
const { frontmatter } = useData()
const isHome = computed(() => frontmatter.value?.layout === 'home')

/* ---------------- 粒子 Canvas ---------------- */
interface Particle {
  x: number; y: number; radius: number
  speedX: number; speedY: number
  opacity: number; hue: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particles: Particle[] = []
let ctx: CanvasRenderingContext2D | null = null

const initParticles = (c: HTMLCanvasElement) => {
  particles = []
  const count = Math.min(60, Math.floor(c.width / 20))
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 30 + 15
    })
  }
}

const draw = () => {
  const c = canvasRef.value
  if (!c || !ctx) return
  ctx.clearRect(0, 0, c.width, c.height)

  particles.forEach((p) => {
    p.x += p.speedX
    p.y += p.speedY
    if (p.x < 0) p.x = c.width
    if (p.x > c.width) p.x = 0
    if (p.y < 0) p.y = c.height
    if (p.y > c.height) p.y = 0

    const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4)
    g.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.opacity})`)
    g.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`)
    ctx!.beginPath()
    ctx!.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2)
    ctx!.fillStyle = g
    ctx!.fill()

    ctx!.beginPath()
    ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx!.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`
    ctx!.fill()
  })

  // 粒子间蛛网连线
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.hypot(dx, dy)
      if (dist < 120) {
        ctx!.beginPath()
        ctx!.moveTo(particles[i].x, particles[i].y)
        ctx!.lineTo(particles[j].x, particles[j].y)
        ctx!.strokeStyle = `hsla(280, 60%, 50%, ${0.08 * (1 - dist / 120)})`
        ctx!.lineWidth = 0.5
        ctx!.stroke()
      }
    }
  }

  animationId = requestAnimationFrame(draw)
}

const resize = () => {
  const c = canvasRef.value
  if (!c || !c.parentElement) return
  c.width = c.parentElement.clientWidth
  c.height = c.parentElement.clientHeight
  initParticles(c)
}

const start = () => {
  const c = canvasRef.value
  if (!c) return
  resize()
  ctx = c.getContext('2d')
  if (!ctx) return
  if (animationId) cancelAnimationFrame(animationId)
  draw()
}

const stop = () => {
  if (animationId) cancelAnimationFrame(animationId)
  animationId = null
}

onMounted(() => {
  start()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  stop()
  window.removeEventListener('resize', resize)
})

/* SPA 路由切换：从文档页返回首页时，canvas 尺寸可能变了，重跑一次 */
const route = useRoute()
watch(
  () => route.path,
  async () => {
    await nextTick()
    if (isHome.value) start()
    else stop()
  }
)
</script>

<style scoped>
/* ============ 全屏固定装饰层 ============ */
.hw-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
}

/* ============ 粒子画布（仅首页） ============ */
.hw-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* ============ 四角蛛网 ============ */
.hw-web {
  position: absolute;
  width: 150px;
  height: auto;
  opacity: 0.28;
  user-select: none;
}
.hw-web-tl { top: 0; left: 0; }
.hw-web-tr { top: 0; right: 0; transform: scaleX(-1); }
.hw-web-bl { bottom: 0; left: 0; transform: scaleY(-1); }
.hw-web-br { bottom: 0; right: 0; transform: scale(-1, -1); }

/* ============ 幽灵 ============ */
.hw-ghost {
  position: absolute;
  top: 18vh;
  right: 4vw;
  width: 64px;
  height: auto;
  opacity: 0.55;
  animation: hw-ghost-drift 9s ease-in-out infinite;
}
@keyframes hw-ghost-drift {
  0%, 100% { transform: translate(0, 0) rotate(-4deg); }
  50%      { transform: translate(-22px, -30px) rotate(4deg); }
}

/* ============ 俯冲蝙蝠（全站周期性） ============ */
.hw-bat-dash {
  position: absolute;
  top: -12vh;
  right: -18vw;
  width: 76px;
  height: auto;
  opacity: 0;
  filter: drop-shadow(0 0 12px rgba(150, 60, 220, 0.6));
  animation: hw-bat-dash 14s cubic-bezier(0.55, 0.06, 0.68, 0.19) infinite;
  animation-delay: 5s;
  will-change: transform, opacity;
}
@keyframes hw-bat-dash {
  0%   { transform: translate(0, 0) rotate(38deg) scale(1);            opacity: 0; }
  3%   { opacity: 1; }
  12%  { transform: translate(-65vw, 55vh) rotate(38deg) scale(0.85);  opacity: 1; }
  16%  { transform: translate(-110vw, 105vh) rotate(38deg) scale(0.7); opacity: 0; }
  100% { transform: translate(-110vw, 105vh) rotate(38deg) scale(0.7); opacity: 0; }
}

/* ============ 南瓜（仅首页） ============ */
.hw-pumpkin {
  position: absolute;
  bottom: 12vh;
  left: 7vw;
  width: 140px;
  height: auto;
  user-select: none;
  animation:
    hw-pumpkin-float 4.5s ease-in-out infinite,
    hw-pumpkin-glow 2.4s ease-in-out infinite alternate;
  will-change: transform, filter;
}
@keyframes hw-pumpkin-float {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50%      { transform: translateY(-22px) rotate(4deg); }
}
@keyframes hw-pumpkin-glow {
  0%   { filter: drop-shadow(0 0 12px rgba(255, 140, 0, 0.45)); }
  100% { filter: drop-shadow(0 0 34px rgba(255, 160, 40, 0.85)); }
}

/* ============ 横飞蝙蝠（仅首页） ============ */
.hw-bat {
  position: absolute;
  height: auto;
  user-select: none;
  transform-origin: center;
  filter: drop-shadow(0 0 8px rgba(120, 40, 180, 0.55));
  animation:
    hw-bat-fly linear infinite,
    hw-bat-flap ease-in-out infinite alternate;
  will-change: transform;
}
.hw-bat-1 { top: 14%; width: 60px; animation-duration: 9s,   0.40s; animation-delay: 0s,   0s; }
.hw-bat-2 { top: 34%; width: 42px; animation-duration: 12s,  0.52s; animation-delay: -4s, -0.2s; }
.hw-bat-3 { top: 56%; width: 72px; animation-duration: 7.5s, 0.36s; animation-delay: -2s, -0.1s; }

@keyframes hw-bat-fly {
  0%   { transform: translateX(-80px) translateY(0); }
  25%  { transform: translateX(25vw)  translateY(-34px); }
  50%  { transform: translateX(50vw)  translateY(12px); }
  75%  { transform: translateX(75vw)  translateY(-24px); }
  100% { transform: translateX(110vw) translateY(0); }
}
@keyframes hw-bat-flap {
  0%   { scale: 1 1; }
  100% { scale: 1.06 0.62; }
}

/* ============ 暗色模式 ============ */
:global(.dark) .hw-web      { opacity: 0.18; }
:global(.dark) .hw-ghost    { opacity: 0.65; }
:global(.dark) .hw-bat-dash { filter: drop-shadow(0 0 16px rgba(170, 80, 240, 0.8)); }
:global(.dark) .hw-bat      { filter: drop-shadow(0 0 12px rgba(150, 60, 220, 0.75)); }
:global(.dark) .hw-pumpkin  {
  animation:
    hw-pumpkin-float 4.5s ease-in-out infinite,
    hw-pumpkin-glow-dark 2.4s ease-in-out infinite alternate;
}
@keyframes hw-pumpkin-glow-dark {
  0%   { filter: drop-shadow(0 0 16px rgba(255, 140, 0, 0.55)); }
  100% { filter: drop-shadow(0 0 46px rgba(255, 170, 50, 1)); }
}

/* ============ 移动端精简 ============ */
@media (max-width: 768px) {
  .hw-web      { display: none; }
  .hw-ghost    { width: 48px; }
  .hw-pumpkin  { width: 96px; left: 4vw; bottom: 8vh; }
  .hw-bat-3    { display: none; }
}

/* ============ 尊重系统"减少动效"偏好 ============ */
@media (prefers-reduced-motion: reduce) {
  .hw-ghost, .hw-bat-dash, .hw-pumpkin, .hw-bat { animation: none; }
  .hw-bat-dash { opacity: 0; }
}
</style>