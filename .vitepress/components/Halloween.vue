<template>
  <div class="hw-layer" aria-hidden="true">
    <img class="hw-ghost" :src="ghost" alt="" />
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
  top: 16vh;
  right: 5vw;
  width: 58px;
  height: auto;
  opacity: 0.55;
  user-select: none;
  will-change: transform;
  animation: hw-ghost-float 6.5s ease-in-out infinite;
}

@keyframes hw-ghost-float {
  0%, 100% { transform: translate(0, 0)    rotate(-4deg); }
  50%      { transform: translate(6px, -26px) rotate(4deg); }
}

/* ============ 暗色模式：仅反色 ============ */
:global(.dark) .hw-ghost {
  filter: invert(1);
}

@media (max-width: 768px) {
  .hw-ghost { width: 44px; right: 3vw; top: 13vh; }
}

@media (prefers-reduced-motion: reduce) {
  .hw-ghost { animation: none; }
}
</style>