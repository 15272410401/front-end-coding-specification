import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "前端编码规范",
  description: "前端编码规范工程化",
  head: [
    ['link', { rel: 'icon', href: '/img/logo.svg' }],
    ['meta', { name: 'keywords', content: '前端编码规范工程化' }],
  ],
  base: '/front-end-coding-specification/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/img/logo.svg',

    // 导航搜索栏
    search: {
      provider: 'local'
    },
    // 导航栏
    nav: [
      { text: '首页', link: '/index.md' },
      {
        text: '编码规范',
        items: [
          { text: 'HTML 编码规范', link: '/coding/html.md' },
          { text: 'CSS 编码规范', link: '/coding/css.md' },
          { text: 'JavaScript 编码规范', link: '/coding/javascript.md' },
          { text: 'Typescript 编码规范', link: '/coding/typescript.md' },
          { text: 'Node 编码规范', link: '/coding/node.md' },
        ]
      },
      {
        text: '工程规范',
        items: [
          { text: 'Git 规范', link: '/engineering/git.md' },
          { text: '文档规范', link: '/engineering/doc.md' },
          { text: 'CHANGELOG 规范', link: '/engineering/changelog.md' },
        ]
      },
      {
        text: 'NPM包',
        items: [
          { text: 'eslint-config-hcl', link: '/npm/eslint-config-hcl.md' },
          { text: 'stylelint-config-hcl', link: '/npm/stylelint-config-hcl.md' },
          { text: 'markdownlint-config', link: '/npm/markdownlint-config-hcl.md' },
          { text: 'commitlint-config', link: '/npm/commitlint-config-hcl.md' },
          { text: 'eslint-plugin-hcl', link: '/npm/eslint-plugin-hcl.md' },
        ]
      },
      {
        text: '脚手架',
        items: [
          { text: 'front-coding-spec-lint', link: '/cli/front-coding-spec-lint.md' },
        ]
      }
    ],

    // 导航栏-社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/15272410401/front-end-coding-specification' }
    ],
    // 侧边栏
    sidebar: [
      {
        text: '编码规范',
        items: [
          { text: 'HTML 编码规范', link: '/coding/html.md' },
          { text: 'CSS 编码规范', link: '/coding/css.md' },
          { text: 'JavaScript 编码规范', link: '/coding/javascript.md' },
          { text: 'Typescript 编码规范', link: '/coding/typescript.md' },
          { text: 'Node 编码规范', link: '/coding/node.md' },
        ]
      },
      {
        text: '工程规范',
        items: [
          { text: 'Git 规范', link: '/engineering/git.md' },
          { text: '文档规范', link: '/engineering/doc.md' },
          { text: 'CHANGELOG 规范', link: '/engineering/changelog.md' },
        ]
      },
      {
        text: 'NPM包',
        items: [
          { text: 'eslint-config-hcl', link: '/npm/eslint-config-hcl.md' },
          { text: 'stylelint-config-hcl', link: '/npm/stylelint-config-hcl.md' },
          { text: 'markdownlint-config', link: '/npm/markdownlint-config-hcl.md' },
          { text: 'commitlint-config', link: '/npm/commitlint-config-hcl.md' },
          { text: 'eslint-plugin-hcl', link: '/npm/eslint-plugin-hcl.md' },
        ]
      },
      {
        text: '脚手架',
        items: [
          { text: 'front-coding-spec-lint', link: '/cli/front-coding-spec-lint.md' },
        ]
      }
    ],
    // 文档页脚导航
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
  },
})
