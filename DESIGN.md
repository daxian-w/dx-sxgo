# DESIGN.md

> 用购买力投票，支持守规矩的企业 — 双休购品牌设计系统

## 1. Visual Theme & Atmosphere

**Style**: 温暖克制 · 品质信赖
**Keywords**: 温暖、信任、绿色、简约、品质感、透明、有责任感、生活化
**Tone**: 专业可信但有温度 — NOT 冰冷工业风 / 过度花哨 / 廉价促销感
**Feel**: 像是走进一家阳光充沛的有机市集——原木货架、绿植点缀、每件商品都让你安心。

**Interaction Tier**: L2 流畅交互
**Dependencies**: framer-motion（已安装）、CSS keyframes（辅助）

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #FFFAF5;                          /* 暖白页面背景 */
  --surface: #FFFFFF;                     /* 卡片/容器 */
  --surface-alt: #F5F0E8;                 /* 交替 section */
  --surface-hover: #F0F7F3;               /* 悬停态表面 */

  /* Borders */
  --border: #E8DFD3;                      /* 默认边框 */
  --border-hover: #3DAD8A;                /* 悬停边框 */

  /* Text */
  --text: #2A2620;                        /* 标题、重要文字 */
  --text-secondary: #7D7367;              /* 正文、描述 */
  --text-tertiary: #9B8F80;               /* 标签、辅助信息 */

  /* Brand colors */
  --primary: #3DAD8A;                     /* 浅绿色 - 品牌主色 */
  --primary-hover: #2E8B6F;
  --primary-light: #D9EEE5;
  --secondary: #F5C234;                   /* 浅黄色 - 行业切换 */
  --secondary-hover: #E0A820;
  --accent: #99D93F;                      /* 黄绿色 - 活力点缀 */
  --accent-hover: #7DBE2E;
  --beige: #BDB38F;                       /* 米色 - 背景装饰 */
  --ivory-gray: #9B8F80;                  /* 象牙灰 - 辅助文字 */

  /* RGB variants for rgba() */
  --primary-rgb: 61, 173, 138;
  --secondary-rgb: 245, 194, 52;
  --accent-rgb: 153, 217, 63;
  --bg-rgb: 255, 250, 245;

  /* Semantic */
  --success: #22C55E;
  --error: #E5484D;
  --warning: #F59E0B;
}
```

**Color Rules:**
- 所有颜色通过 CSS 变量引用，禁止硬编码 hex
- 背景保持暖白调性，不引入冷灰色
- 绿/黄/黄绿三色按主次使用：绿色主导，黄色用于筛选态，黄绿仅用于装饰
- 同一 section 内只用一个强调色

## 3. Typography Rules

**Font Stack:**
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Noto Serif SC | clamp(2.5rem, 5vw, 4rem) | 700 | 1.2 | 0.02em |
| Tagline | Noto Sans SC | clamp(1rem, 1.5vw, 1.25rem) | 400 | 1.6 | 0.02em |
| Section H2 | Noto Serif SC | clamp(1.5rem, 2.5vw, 2rem) | 600 | 1.3 | 0.02em |
| Company Name | Noto Sans SC | 0.9375rem | 600 | 1.4 | — |
| Body | Noto Sans SC | 0.875rem | 400 | 1.6 | 0.02em |
| Label/Badge | Noto Sans SC | 0.75rem | 600 | 1.3 | 0.04em |
| Stat Number | IBM Plex Mono | clamp(1.25rem, 2vw, 1.75rem) | 500 | 1 | — |

**Typography Rules:**
- 标题使用 Noto Serif SC 衬线体，传递品质和信任感
- 正文使用 Noto Sans SC，确保长文本可读性
- 中文行高 ≥ 1.7，确保阅读舒适
- **NEVER use**: 非中文字体作为主字体（如仅 Inter/Poppins 无中文字体回退）

**Text Decoration:**
- Hero H1: 关键字使用渐变（primary → accent → secondary），无投影
- Section H2: 纯色，无渐变
- 数字统计: 使用等宽字体 IBM Plex Mono

## 4. Component Stylings

### Buttons
```css
/* 主按钮 — 绿色填充 */
.btn-primary {
  @apply px-6 py-2.5 rounded-full font-semibold bg-primary-600 text-white 
         hover:bg-primary-700 active:bg-primary-800 
         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-all duration-300;
}

/* 次按钮 — 白色描边 */
.btn-secondary {
  @apply px-6 py-2.5 rounded-full font-semibold bg-white border-2 border-neutral-200 text-neutral-700 
         hover:border-primary-300 hover:bg-primary-50 
         active:bg-primary-100 active:border-primary-400
         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-all duration-300;
}

/* 筛选按钮 — 黄色激活态 */
.btn-filter {
  @apply px-5 py-2 rounded-full font-semibold border-2 text-sm
         transition-all duration-300;
}
.btn-filter-active {
  @apply bg-secondary-500 text-neutral-900 border-secondary-500 shadow-md;
}
.btn-filter-inactive {
  @apply bg-white border-neutral-200 text-neutral-600 
         hover:border-secondary-300 hover:bg-secondary-50;
}
```

### Cards / Table Rows
```css
/* 表格行 */
.table-row {
  @apply border-b border-neutral-100 transition-all duration-200;
}
.table-row:hover {
  @apply bg-primary-50/50;
}

/* 统计卡片 */
.stat-card {
  @apply bg-white rounded-xl border border-neutral-200 p-6 
         hover:border-primary-200 hover:shadow-md 
         transition-all duration-300;
}
```

### Navigation
```css
/* 导航栏 — 粘性 + 毛玻璃 */
.navbar {
  @apply sticky top-0 z-50 transition-all duration-300;
}
.navbar-default {
  @apply bg-transparent;
}
.navbar-scrolled {
  @apply backdrop-blur-xl bg-white/80 border-b border-primary-100/30 shadow-sm;
}
```

### Tags / Badges
```css
/* 行业标签 */
.tag-industry {
  @apply inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 
         text-xs font-semibold whitespace-nowrap;
}

/* 认证标识 */
.tag-cert {
  @apply inline-flex items-center justify-center w-7 h-7 rounded-full 
         bg-green-100 text-green-600 text-sm;
}
```

### Search Input
```css
.search-input {
  @apply w-full px-6 py-3.5 rounded-xl border-2 border-neutral-200 
         bg-white/90 backdrop-blur-sm
         placeholder:text-neutral-400
         focus:border-primary-500 focus:outline-none focus:shadow-lg focus:shadow-primary-100/50
         transition-all duration-300 text-base;
}
```

## 5. Layout Principles

**Container:**
- Max width: 1280px
- Padding: 1rem (mobile), 2rem (tablet), 3rem (desktop)

**Spacing Scale:**
- Section padding: clamp(3rem, 6vw, 6rem) top/bottom
- Component gap: 1.5rem
- Card internal padding: 1.5rem
- Table cell padding: 1rem 1.5rem

**Grid:**
```css
/* 行业筛选按钮容器 */
.filter-grid {
  @apply flex flex-wrap gap-3 justify-center;
}

/* 统计卡片网格 */
.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}
```

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | box-shadow: none | 页面背景、表格 body |
| Subtle | 0 1px 3px rgba(0,0,0,0.05) | 导航栏、次要卡片 |
| Elevated | 0 4px 12px rgba(61,173,138,0.15) | 搜索框 focus 态、筛选激活态 |
| Modal | 0 8px 32px rgba(0,0,0,0.12) | 弹窗、下拉面板 |

## 7. Animation & Interaction

**Motion Philosophy**: 轻量克制，只为增强体验而动，不为炫技。
**Tier**: L2 流畅交互

### Dependencies
```html
<!-- framer-motion 已通过 npm 安装 -->
```

### Entrance Animation

Hero 区域：
- H1 标题：逐字/渐入入场（framer-motion stagger）
- 搜索框：从下向上滑入 + 淡入
- 标签栏：逐项 stagger 入场

Section 标题：
- 滚动触发 `whileInView={{ opacity: 1, y: 0 }}`

表格行：
- 逐行 stagger 淡入（筛选切换时）

```tsx
// framer-motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}
```

### Scroll Behavior
- Section 标题：`whileInView` 触发 fadeInUp + scale 微动
- 统计数字：滚动到视口后 CountUp 动画
- 导航栏：滚动 60px 后切换为毛玻璃样式

### Hover & Focus States
- 表格行 hover: 淡绿色背景 + 微左偏移
- 搜索框 focus: 绿色边框 + 绿色阴影光晕
- 筛选按钮 hover: 轻微上浮 + 边框变色
- 导航链接 hover: 底部渐现下划线

### Special Effects
- Hero 标题关键字「守规矩」使用渐变文字，流动动画
- 搜索框获得焦点时，底部出现绿色脉冲光晕
- 表格行悬停时右侧微微亮起绿色指示条

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 8. Do's and Don'ts

### Do
- 使用品牌色系中的绿色作为主要交互反馈色
- 在表格中使用悬停高亮提高可扫描性
- 搜索和筛选结果即时更新（无额外点击）
- 企业数量统计始终可见，增强透明度
- 使用毛玻璃导航栏保持内容层级
- 中文内容使用中文字体族
- 表格适配横向滚动（移动端）
- 每页保持品牌色一致性

### Don't
- ❌ 使用冷灰色背景（保持暖白调性）
- ❌ 引入第四个强调色（三色体系足够）
- ❌ 使用纯 emoji 做认证标识
- ❌ 表格列宽自适应导致折行（保持固定比例）
- ❌ 搜索无结果时显示空白（必须有友好提示）
- ❌ 使用动画打断用户浏览（保持在视口内触发）
- ❌ 给重要数据使用等宽字体以外的字体
- ❌ 在移动端使用复杂动画（保持简洁）
- ❌ 筛选按钮使用危险/红色系
- ❌ 文字使用低于 14px 的字号

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1024px | 全宽表格、三栏统计、更多内边距 |
| Tablet | 640-1024px | 表格缩小内边距、两栏统计 |
| Mobile | < 640px | 单栏统计、表格横向滚动、搜索框全宽 |

**Touch Targets:** minimum 44×44px（筛选按钮）
**Collapsing Strategy:** 移动端表格启用水平滚动，筛选按钮自动换行

```css
@media (max-width: 640px) {
  .table-wrapper {
    @apply -mx-4 overflow-x-auto;
  }
  .filter-container {
    @apply gap-2;
  }
}
```