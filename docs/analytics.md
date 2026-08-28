# Analytics（Google Analytics 4）

> 给站点维护者看的开发文档。
> README 只放一句话指针，详细配置、事件结构、后台操作都放在这里。

文档站默认**不加载**任何分析脚本。启用 GA4 后可以追踪：

- 访客从哪个外站 / 搜索引擎 / UTM 进来（流量来源）
- 访客在站内看了哪些页面、停留多久（行为）
- **访客从站内哪个具体页面 / 哪个位置点击"加入 Discord"按钮**（转化漏斗）

---

## 1. 获取 Measurement ID

1. 打开 [Google Analytics](https://analytics.google.com/) → 管理 → 创建/选择媒体资源
2. 数据流选 **Web** → 输入 `https://steinsinn.app`
3. 复制 **衡量 ID**（形如 `G-ABC123XYZ`）

---

## 2. 填入项目

编辑 `.vitepress/config.mts` 顶部：

```ts
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // ← 替换成你的 ID
```

未填或保留占位值时，**构建产物里不会有任何 GA 代码**，不会影响加载速度或隐私。

---

## 3. 追踪到的事件

启用后，每次访客点击站内任何 `discord.gg` / `discord.com/invite` 链接，会触发一个事件：

| 事件名 | 关键参数 |
|---|---|
| `click_join_discord` | `from_path`（来源页路径，如 `/zh/features/ai-chat`）<br>`from_title`（来源页标题）<br>`link_text`（链接文案，前 80 字符）<br>`link_location`（链接位置：`nav` / `hero` / `social` / `footer` / `content` / `sidebar` / `other`）<br>`outbound_url`（完整 Discord 链接） |

事件使用 `transport_type: 'beacon'`，浏览器跳转到 Discord 时事件**不会丢失**。

### 触发位置

`.vitepress/components/Layout.vue` 里通过全局 `onMounted` + 路由切换 `watch` 扫描所有 `a[href]` 链接，对匹配 Discord 域名的链接绑定 click 监听器。所以**站内任何位置新增的 Discord 链接都会被自动追踪**，不需要改业务代码。

### 自定义维度注册

GA4 默认只把 `from_path` / `link_text` 等作为 event params。要按 `link_location` 下钻做漏斗分析，建议在 GA4 后台：

**管理 → 媒体资源 → 自定义定义** 注册：

| 自定义维度 | 作用域 | 参数名 |
|---|---|---|
| `link_location` | Event | `link_location` |
| `from_path` | Event | `from_path`（可选，page path 已自动收集） |
| `outbound_url` | Event | `outbound_url`（可选） |

注册后约 24–48 小时生效。

---

## 4. GA 后台建议配置

部署后等 24–48 小时让 GA 收集到数据，然后：

- **Reports → Engagement → Events** → 找到 `click_join_discord`，可按 `from_path` / `link_location` 维度下钻，看到"访客从哪个页面/哪个位置点 Discord 最多"
- **Reports → Acquisition → Traffic acquisition** → 看访客从哪个外站 / 搜索引擎 / UTM 进来
- **Reports → User attributes → Demographics** → 看地域 / 语言 / 设备分布
- （推荐）将 `click_join_discord` 标记为 **Conversion**（管理 → 媒体资源 → 转化 → 新建转化事件 → 选 `click_join_discord`）
- （推荐）建一个 **Exploration** 漏斗报告：`page_view` → `click_join_discord` → 看每页的转化率

---

## 5. 关闭 / 替换

### 关闭

把 `.vitepress/config.mts` 顶部的 `GA_MEASUREMENT_ID` 改回 `G-XXXXXXXXXX` 或留空，重新部署即可。构建产物里 0 字节 GA 代码。

### 替换为其他分析（Plausible / Umami / Cloudflare Analytics / Matomo …）

两处改动：

1. **替换 gtag 注入**：编辑 `.vitepress/config.mts` 里的 `ga4HeadEntries`，换成你选的分析服务提供的 `<script>` 标签（保留同样的开关逻辑：当 Measurement ID 为占位值时不加载）
2. **替换事件触发**：编辑 `.vitepress/components/Layout.vue` 里的 `fireJoinDiscordEvent` 函数，把 `window.gtag(...)` 调用换成对应服务的 API。例如 Plausible 用 `window.plausible('Join Discord', { props: { from_path, link_location, ... } })`，Umami 用 `window.umami?.track('join-discord', { from_path, link_location })`。

DOM 扫描、链接位置推断、beacon transport 这些**与具体分析服务无关**的逻辑都保留，不需要重写。

---

## 6. 隐私与合规

- GA4 默认开启 **Cookie-less mode**（用 `send_page_view: true` 即可，不调用 `gtag('consent', 'update', ...)` 时走的是 consent state default）
- 如面向欧盟用户，建议在 `.vitepress/config.mts` 的 `head` 里加一个 cookie consent 横幅，或在 `gtag('config', ...)` 调用前根据用户选择更新 consent 状态
- 中国大陆访问 GA 服务器慢甚至不通是已知问题；如要兼顾国内流量可考虑改用 [百度统计](https://tongji.baidu.com/) / [Umami 自部署] 双写（两边都加进 `ga4HeadEntries` 同款结构）
