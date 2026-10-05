<template>
  <div class="halloween-container">
    <canvas ref="canvasRef" class="particle-canvas" />
    <div class="pumpkin">🎃</div>
    <div class="bat bat-1">🦇</div>
    <div class="bat bat-2">🦇</div>
    <div class="bat bat-3">🦇</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  radius: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particles: Particle[] = []

const initParticles = (canvas: HTMLCanvasElement) => {
  particles = []
  const count = Math.min(60, Math.floor(canvas.width / 20))
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 30 + 15 // 橙色系 15-45
    })
  }
}

const animate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach((p) => {
    p.x += p.speedX
    p.y += p.speedY

    if (p.x < 0) p.x = canvas.width
    if (p.x > canvas.width) p.x = 0
    if (p.y < 0) p.y = canvas.height
    if (p.y > canvas.height) p.y = 0

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4)
    gradient.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.opacity})`)
    gradient.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`)

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`
    ctx.fill()
  })

  // 粒子间的连线（蜘蛛网效果）
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `hsla(280, 60%, 50%, ${0.08 * (1 - dist / 120)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }

  animationId = requestAnimationFrame(() => animate(ctx, canvas))
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas || !canvas.parentElement) return
  const parent = canvas.parentElement
  canvas.width = parent.offsetWidth
  canvas.height = parent.offsetHeight
  initParticles(canvas)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  handleResize()
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  animate(ctx, canvas)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.halloween-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.pumpkin {
  position: absolute;
  bottom: 15%;
  left: 8%;
  font-size: 3rem;
  animation: pumpkin-float 4s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(255, 140, 0, 0.5));
}

@keyframes pumpkin-float {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.bat {
  position: absolute;
  font-size: 1.5rem;
  animation: bat-fly 8s linear infinite;
  filter: drop-shadow(0 0 10px rgba(80, 0, 120, 0.6));
}

.bat-1 { top: 15%; animation-delay: 0s; }
.bat-2 { top: 35%; animation-delay: -3s; font-size: 1.2rem; }
.bat-3 { top: 55%; animation-delay: -5s; font-size: 1.8rem; }

@keyframes bat-fly {
  0%   { transform: translateX(-60px) translateY(0) scaleX(1); }
  25%  { transform: translateX(25vw) translateY(-30px) scaleX(1); }
  50%  { transform: translateX(50vw) translateY(10px) scaleX(1); }
  75%  { transform: translateX(75vw) translateY(-20px) scaleX(1); }
  100% { transform: translateX(110vw) translateY(0) scaleX(1); }
}

:global(.dark) .pumpkin {
  filter: drop-shadow(0 0 30px rgba(255, 140, 0, 0.8));
}
</style>