<!-- 官方的外观切换代码：https://vitepress.dev/zh/guide/extending-default-theme#on-appearance-toggle -->
<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, provide, watch } from 'vue'
import Waline from './Waline.vue' // 引入你那个全功能的 Waline 组件
const { Layout } = DefaultTheme

const { isDark, route } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})

// ============================================================
// Discord 点击追踪（Google Analytics 4）
// ------------------------------------------------------------
// 拦截站内所有指向 discord.gg / discord.com/invite 的链接点击，
// 通过 gtag.js 发送 click_join_discord 事件，附带来源页信息。
// 使用 transport_type: 'beacon' 确保浏览器立即跳转时事件也能送达。
// gtag 由 .vitepress/config.mts 里的 GA4 注入提供；未配置时为 no-op。
// ============================================================

// 匹配 discord.gg/<code> 与 discord.com/invite/<code>（含子域名）
const DISCORD_REGEX = /^https?:\/\/(?:[a-z0-9-]+\.)*discord(?:\.gg|\.com\/invite)\//i

/** 推断 Discord 链接在页面上的位置，用于 GA 维度下钻分析。 */
const detectLinkLocation = (el: HTMLElement | null): string => {
  if (!el) return 'unknown'
  if (el.closest('header.VPNav, .VPNavBar, .VPNav')) return 'nav'
  if (el.closest('.VPSocialLinks, .VPNavBarSocialLinks')) return 'social'
  if (el.closest('.VPHero, .VPHomeHero, .VPButtonGroup')) return 'hero'
  if (el.closest('footer.VPFooter, .VPFooter')) return 'footer'
  if (el.closest('aside.VPSidebar, .VPSidebar')) return 'sidebar'
  if (el.closest('main .VPDoc, .VPDoc, .VPDocContent')) return 'content'
  return 'other'
}

const fireJoinDiscordEvent = (a: HTMLAnchorElement) => {
  // gtag 由 GA4 脚本提供；未配置 Measurement ID 时不存在。
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  gtag('event', 'click_join_discord', {
    from_path: route.path,
    from_title: document.title,
    link_text:
      (a.textContent || '').trim().slice(0, 80) ||
      a.getAttribute('aria-label') ||
      a.href,
    link_location: detectLinkLocation(a),
    outbound_url: a.href,
    transport_type: 'beacon',
  })
}

const bindDiscordTrackers = () => {
  if (typeof document === 'undefined') return
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href]')
  links.forEach((a) => {
    if (!DISCORD_REGEX.test(a.href)) return
    // 用 dataset 标记避免重复绑定监听器
    if (a.dataset.gaTracked === '1') return
    a.dataset.gaTracked = '1'
    a.addEventListener('click', () => fireJoinDiscordEvent(a))
  })
}

onMounted(() => {
  // 首屏立即扫描
  bindDiscordTrackers()
  // 兜底：部分链接（如图标）可能在懒加载，500ms 后再扫一遍
  setTimeout(bindDiscordTrackers, 500)
})

// VitePress SPA 路由切换不会卸载整个 DOM，但 sidebar/hero 等区域会被替换，
// 切换后重新扫描一次以绑定新出现的 Discord 链接。
watch(
  () => route.path,
  () => {
    nextTick(bindDiscordTrackers)
  }
)
</script>

<template>
  <Layout>
    <template #doc-after>
      <Waline />
    </template>
  </Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none;
}
</style>
