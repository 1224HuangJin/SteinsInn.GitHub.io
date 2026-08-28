---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Steins;Inn 次元旅社"
  text: "AI角色扮演·动漫<br>游戏·闲聊"
#  tagline: "哼，听好了！我是 Senpai·最强AI Bot·次元旅社的看板娘。"
  
  image:
    src: /images/r-1024x1024.png # 确保你的 public 目录下有这个图片
    alt: Steins;Inn Logo

  actions:
    - theme: brand
      text: 🛕 开始浏览文档
      link: /zh/guide/getting-started
    - theme: brand
      text: 🚀 立马加入 Discord
      link: https://discord.gg/jx5Z6NfuTP
    - theme: alt
      text: 关于次元旅社
      link: /zh/about


features:
  - title: "✨ AI 对话"
    details: "50+ 大模型任选（GPT、Claude、Gemini、Grok、MiniMax、DeepSeek、豆包、Kimi、Qwen、GLM...）"
  - title: "🎨 AI 创作"
    details: "生图（Nano Banana / 豆包 / Grok / MiniMax / Flux）、作曲（Suno / MiniMax）、生成视频（Wan / hailuo / Seedance / Sora），样样精通"
  - title: "🎭 酒馆角色卡"
    details: "直接在 Discord 里玩酒馆！完整支持 SillyTavern，预设、世界书、记忆系统全都有。（尊重酒馆生态：角色卡仅自己可见，随时可删。）"

# 网页元数据 (SEO)
head:
- - meta
  - property: og:type
    content: website
- - meta
  - property: og:title
    content: Steins;Inn 次元旅社
- - meta
  - property: og:image
    content: https://steinsinn.app/images/r-1024x1024.png
- - meta
  - property: og:url
    content: https://steinsinn.app/
- - meta
  - name: title
    content: Steins;Inn 次元旅社
- - meta
  - name: description
    content: 一个可以与AI对话，生图，作曲，生成视频，以及玩AI角色扮演(SillyTavern)的Discord服务器。
- - meta
  - name: twitter:card
    content: https://steinsinn.app/images/r-1024x1024.png
- - link
  - rel: icon
    type: image/icon
    href: https://steinsinn.app/images/favicon.ico
---
