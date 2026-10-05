<template>
  <div class="hw-layer" aria-hidden="true">
    <div class="hw-ghosts">
      <img class="hw-ghost hw-ghost-a" :src="ghost" alt="" />
      <img class="hw-ghost hw-ghost-b" :src="ghost" alt="" />
    </div>
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

/* ---- 幽灵对：整对一起漂 ---- */
.hw-ghosts {
  position: absolute;
  top: 18vh;
  right: 6vw;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  animation: hw-pair-drift 7s ease-in-out infinite;
  will-change: transform;
}

@keyframes hw-pair-drift {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(-10px, -22px); }
}

/* ---- 每只幽灵：上下轻摆（相位错开） ---- */
.hw-ghost {
  height: auto;
  user-select: none;
  will-change: transform;
}

.hw-ghost-a {
  width: 72px;
  animation: hw-ghost-bob 4s ease-in-out infinite;
}

.hw-ghost-b {
  width: 54px;
  animation: hw-ghost-bob 4s ease-in-out infinite;
  animation-delay: -2s;
}

@keyframes hw-ghost-bob {
  0%, 100% { transform: translateY(0)    rotate(-3deg); }
  50%      { transform: translateY(-8px) rotate(3deg); }
}

/* ============ 暗色模式：仅反色，其他一律不动 ============ */
:global(.dark) .hw-ghost {
  filter: invert(1);
}

/* ---- 移动端 ---- */
@media (max-width: 768px) {
  .hw-ghosts  { top: 14vh; right: 4vw; }
  .hw-ghost-a { width: 54px; }
  .hw-ghost-b { width: 42px; }
}

/* ---- 系统"减少动效" ---- */
@media (prefers-reduced-motion: reduce) {
  .hw-ghosts, .hw-ghost { animation: none; }
}
</style>