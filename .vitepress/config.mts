import { defineConfig } from "vitepress";

// ============================================================
// Google Analytics 4 (GA4) 配置
// ------------------------------------------------------------
// 留空字符串或保持占位值 `G-XXXXXXXXXX` 时不会加载 GA。
// 填入你自己的 GA4 Measurement ID 后生效（形如 G-ABC123XYZ）。
// 详见 README -> "Analytics（Google Analytics 4）" 一节。
// ============================================================
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
const GA_ENABLED = GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX";

// 构造 GA4 head 注入。VitePress 在 SSR 阶段会渲染这些 <script> 标签。
const ga4HeadEntries: [string, Record<string, string>][] = GA_ENABLED
  ? [
      [
        "script",
        {
          async: "true",
          src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
        },
      ],
      [
        "script",
        {},
        `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });`,
      ],
    ]
  : [];

// https://vitepress.dev/zh/reference/site-config
export default defineConfig({
      title: "Steins;Inn 次元旅社",
      // 以下Description为发送链接时的描述
      description: "Discord 内的 AI社区 | 50+顶级模型随心聊（GPT/Claude/Gemini/与更多...）· Sora视频/Flux图片/Suno音乐创作 · SillyTavern角色扮演 ·积分任务福利系统 | 二次元爱好者的AI乐园",

      // 这里是一个被注释掉的功能：  【base: "/",】 可以总是以斜杠结尾
      cleanUrls: true,

      head: [
        ["link", { rel: "icon", href: "/images/favicon.ico" }],
        ...ga4HeadEntries,
      ],

      lastUpdated: true,

      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        // 显示在主页右侧的logo?
        logo: '/images/r-1024x1024.png',
        // 右上角的社交媒体
        socialLinks: [
          { icon: "github", link: "https://github.com/SteinsInn/SteinsInn.GitHub.io" },
          { icon: "discord", link: "https://discord.gg/jx5Z6NfuTP" },
        ],

        // 搜索功能 https://vitepress.dev/zh/reference/default-theme-search
        search: {
          provider: 'local',
          options: {
            locales: {
              root: { // 如果你想翻译默认语言，请将此处设为 `root`
                translations: {
                  button: {
                    buttonText: '搜索',
                    buttonAriaLabel: '搜索'
                  },
                  modal: {
                    displayDetails: '显示详细列表',
                    resetButtonTitle: '重置搜索',
                    backButtonTitle: '关闭搜索',
                    noResultsText: '没有结果',
                    footer: {
                      selectText: '选择',
                      selectKeyAriaLabel: '输入',
                      navigateText: '导航',
                      navigateUpKeyAriaLabel: '上箭头',
                      navigateDownKeyAriaLabel: '下箭头',
                      closeText: '关闭',
                      closeKeyAriaLabel: 'Esc'
                        }
                      }
                    }
                  }
                }
              }
            },

          editLink: {
            pattern: "https://github.com/SteinsInn/SteinsInn.GitHub.io/edit/main/:path",
            text: "在 GitHub 上编辑本页",
          },

          lastUpdated: {
            text: "最后更新于",
            formatOptions: {
              dateStyle: "full",
              timeStyle: "full",
              forceLocale: true,
              },
            },
          },

        //          markdown: {
        //            image: {
        //              lazyLoading: true,
        //            }
        //          },

          locales: {
              // ==================== 简体中文配置 ====================
              root: {
                label: "简体中文",
                lang: "zh-CN", 
                link: "/zh/",
                themeConfig: {
                  nav: [
                    { text: "首页", link: "/zh" },
                    { text: "🧭 指南", link: "/zh/guide" },
                    { text: "🛠️ 功能", link: "/zh/features" },
                    { text: "❓ 常见问题", link: "/zh/faq" },
                    { text: "🍻 关于", link: "/zh/about" },
                    { text: "加入服务器", link: "https://discord.gg/jx5Z6NfuTP" }
                  ],
                  // 以下为侧边栏内容
                  sidebar: [
                    {
                      text: "🧭 指南",
                      items: [
                        { text: "新手入门", link: "/zh/guide/getting-started" },
                        { text: "积分系统", link: "/zh/guide/points-system" },
                        { text: "任务系统", link: "/zh/guide/quest-system" },
                        { text: "好感度系统", link: "/zh/guide/favor-system" },
                    //  { text: "社区规则", link: "/zh/guide/rules" },
                      ]
                    },
                    {
                      text: "🛠️ 功能",
                      items: [
                        { text: "AI对话", link: "/zh/features/ai-chat" },
                        { text: "图片生成", link: "/zh/features/image-gen" },
                        { text: "音乐生成", link: "/zh/features/music-gen" },
                        { text: "视频生成", link: "/zh/features/video-gen" },
                        { text: "语音合成（TTS）", link: "/zh/features/tts" },
                        { text: "Role Play", link: "/zh/features/roleplay" }
                      ]
                    },
                    {
                      text: "📚 帮助与信息",
                      items: [
                        { text: "FAQ", link: "/zh/faq" },
                        { text: "关于", link: "/zh/about" },
                      ]
                    }
                  ],
                  footer: {
                    message: '本网站上的所有内容均根据 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 发布。',
                    copyright: 'Copyright © 2026 Steins;Inn 次元旅社'
                  },
                  editLink: {
                    pattern: "https://github.com/SteinsInn/SteinsInn.GitHub.io/edit/main/:path",
                    text: "在 GitHub 上编辑本页"
                  },
                 // 汉化了"On this page"
                  outline: {
                     label: '页面导航',
                     level: 'deep'
                  },
                  // 汉化了 "Previous page" 与 "Next page"。
                  docFooter: {
                    prev: '上一篇',
                    next: '下一篇'
                  }
                }
              },

              // ==================== 英文配置 ====================
              // en: {
              //   label: "English",
              //   lang: "en-US",
              //   // 在正式更改或者说启用的时候请将下面的 "/" 改为 "/en/"
              //   link: "/",
              //   themeConfig: {
              //     nav: [
              //       { text: "Home", link: "/"},
              //       { text: "Join Discord", link: "https://discord.gg/jx5Z6NfuTP" }
              //     ],
              //     // 以下为侧边栏内容
              //     sidebar: [
              //       {
              //         text: "🏠 Newcomer Guide",
              //         items: [

              //         ]
              //       },
              //     ],
              //     footer: {
              //       message: 'All content on this website released under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>',
              //       copyright: 'Copyright © 2026 Steins;Inn 次元旅社'
              //     },
              //     lastUpdated:{
              //       text: 'Last update at',
              //       formatOptions: {
              //         dateStyle: 'full',
              //         timeStyle: 'medium',
              //         forceLocale: true,
              //       }
              //     },                  
              //     editLink: {
              //         pattern: "https://github.com/SteinsInn/SteinsInn.GitHub.io/edit/main/:path",
              //         text: "Edit this page on GitHub"
              //       }
              //   }
              // }
            }
          });
