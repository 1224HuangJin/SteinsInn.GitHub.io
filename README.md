
# 🏨 Steins;Inn 次元旅社 - 官方文档网站

> 穿越次元的 AI 社区 | *El Psy Kongroo*

## 🌐 网站

[SteinsInn.App](https://steinsinn.app)

## 📖 简介

这是 [Steins;Inn（次元旅社）](https://discord.gg/jx5Z6NfuTP) Discord 服务器的官方文档网站源码。

**Steins;Inn 次元旅社** 是一个集成 **52+ 种大语言模型**的**多模态 AI 社区**，提供 **AI 对话**、**图片**/**音乐**/**视频生成**、**角色扮演**等**功能**，面向 **ACG 爱好者**和 **AI 创作者**。

## ✨ 网站内容

- 🧭 【**指南**】 - *新手入门*、*积分系统*、*任务系统*、*社区规则*
- 🛠️ 【**功能**】 - *AI 对话*、*图片生成*、*音乐生成*、*视频生成*、*语音合成*、*Role Play*（*角色扮演*）
- ❓ 【**FAQ**】 - *常见问题*
- 🍻 【**关于**】 - *关于次元旅社*

## 🛠️ 技术栈

- [VitePress](https://vitepress.dev/) - *原网站模板*
- [Cloudflare Pages](https://pages.cloudflare.com/) - *部署托管*
- [Google Analytics 4](https://marketingplatform.google.com/about/analytics/) - *流量与 Discord 转化追踪*（可选）

## 📊 Analytics（Google Analytics 4）

文档站默认**不加载**任何分析脚本。如需启用 GA4 并追踪访客从网站到 Discord 的转化漏斗：

### 1. 获取 Measurement ID

1. 打开 [Google Analytics](https://analytics.google.com/) → 管理 → 创建/选择媒体资源
2. 数据流选 **Web** → 输入 `https://steinsinn.app`
3. 复制 **衡量 ID**（形如 `G-ABC123XYZ`）

### 2. 填入项目

编辑 `.vitepress/config.mts` 顶部：

```ts
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // ← 替换成你的 ID
```

未填或保留占位值时，**构建产物里不会有任何 GA 代码**，不会影响加载速度或隐私。

### 3. 追踪到的事件

启用后，每次访客点击站内任何 `discord.gg` / `discord.com/invite` 链接，会触发一个事件：

| 事件名 | 关键参数 |
|---|---|
| `click_join_discord` | `from_path`（来源页路径，如 `/zh/features/ai-chat`）<br>`from_title`（来源页标题）<br>`link_text`（链接文案，前 80 字符）<br>`link_location`（链接位置：`nav` / `hero` / `social` / `footer` / `content` / `sidebar` / `other`）<br>`outbound_url`（完整 Discord 链接） |

事件使用 `transport_type: 'beacon'`，浏览器跳转到 Discord 时事件**不会丢失**。

### 4. GA 后台建议配置

- **Reports → Engagement → Events** → 找到 `click_join_discord`，可按 `from_path` / `link_location` 维度下钻，看到"访客从哪个页面/哪个位置点 Discord 最多"
- **Reports → Acquisition → Traffic acquisition** → 看访客从哪个外站 / 搜索引擎 / UTM 进来
- **Reports → User attributes → Demographics** → 看地域 / 语言 / 设备分布
- （可选）将 `click_join_discord` 标记为 **Conversion**，方便做转化率分析
- （可选）建一个 **Exploration** 漏斗报告：`page_view` → `click_join_discord` → 看每页的转化率

### 5. 关闭/替换

- **关闭**：把 Measurement ID 改回 `G-XXXXXXXXXX` 或留空，重新部署即可
- **替换为其他分析**（Plausible / Umami / Cloudflare Analytics）：编辑 `.vitepress/config.mts` 里的 `ga4HeadEntries` 即可；点击追踪逻辑在 `.vitepress/components/Layout.vue`

## 🌍 多语言

- **简体中文**
- English（计划中）

## 🔗 相关链接

- 💬 [Discord 服务器](https://discord.gg/jx5Z6NfuTP)
- 🌐 [官方网站](https://steinsinn.app)

## 许可

### LICENSE：

本文档所有内容及代码均采用 **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)** (署名—非商业性使用—相同方式共享 4.0 协议国际版) 协议进行授权。

#### 您可以自由地：
- **共享** — 在任何媒介以任何形式复制、发行本作品
- **演绎** — 修改、转换或以本作品为基础进行创作
只要你遵守许可协议条款，许可人就无法收回你的这些权利。
#### 惟须遵守下列条件：
- **署名** — 您必须给出适当的署名，提供指向本许可协议的链接，同时标明是否（对原始作品）作了修改。您可以用任何合理的方式来署名，但是不得以任何方式暗示许可人为您或您的使用背书。
- **非商业性使用** — 您不得将本作品用于商业目的。
- **相同方式共享** — 如果您再混合、转换或者基于本作品进行创作，您必须基于与原先许可协议相同的许可协议 分发您贡献的作品。
   - **没有附加限制** — 您不得适用法律术语或者 技术措施 从而限制其他人做许可协议允许的事情。

#### 原始Vitepress模板链接：
[wyf9/vitepress-template](https://github.com/wyf9/vitepress-template)

---

Copyright © 2026 **Steins;Inn 次元旅社**.
