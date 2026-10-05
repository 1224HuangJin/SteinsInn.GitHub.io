<template>
  <div class="hw-layer" aria-hidden="true">
    <img class="hw-ghost hw-ghost-1" :src="ghost" alt="" />
    <img class="hw-ghost hw-ghost-2" :src="ghost" alt="" />
  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
const ghost = withBase('/halloween/ghost.webp')
</script>

<style scoped>
.hw-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
}

.hw-ghost {
  position: absolute;
  height: auto;
  user-select: none;
  filter: drop-shadow(0 0 12px rgba(200, 220, 255, 0.45));
  will-change: transform;
}

/* 左边那只：稍微大，飘得慢 */
.hw-ghost-1 {
  top: 22vh;
  left: 5vw;
  width: 76px;
  opacity: 0.6;
  animation: hw-ghost-float 8s ease-in-out infinite;
}

/* 右边那只：稍小，镜像朝左，飘得快一点、错开相位 */
.hw-ghost-2 {
  top: 16vh;
  right: 5vw;
  width: 58px;
  opacity: 0.5;
  animation: hw-ghost-float-flip 6.5s ease-in-out infinite;
  animation-delay: -2.5s;
}

@keyframes hw-ghost-float {
  0%, 100% { transform: translate(0, 0) rotate(-4deg); }
  50%      { transform: translate(6px, -26px) rotate(4deg); }
}

@keyframes hw-ghost-float-flip {
  0%, 100% { transform: scaleX(-1) translate(0, 0)    rotate(-4deg); }
  50%      { transform: scaleX(-1) translate(6px, -26px) rotate(4deg); }
}

/* 暗色模式：稍微亮一点 */
:global(.dark) .hw-ghost {
  filter: drop-shadow(0 0 16px rgba(220, 235, 255, 0.65));
}
:global(.dark) .hw-ghost-1 { opacity: 0.7; }
:global(.dark) .hw-ghost-2 { opacity: 0.6; }

/* 移动端 */
@media (max-width: 768px) {
  .hw-ghost-1 { width: 56px; left: 3vw; top: 18vh; }
  .hw-ghost-2 { width: 44px; right: 3vw; top: 13vh; }
}

/* 尊重系统"减少动效"偏好 */
@media (prefers-reduced-motion: reduce) {
  .hw-ghost { animation: none; }
}
</style>