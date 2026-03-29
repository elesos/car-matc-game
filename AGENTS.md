# car-match-3

## 项目概述

类似"羊了个羊"的三消休闲小游戏，玩家在堆叠的汽车 Logo 牌堆中找到三个相同的品牌进行消除。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **包管理**: npm

## 目录结构

```
car-match-3/
├── public/
│   └── logos/          # 汽车品牌 Logo PNG 图片（48 个品牌）
├── src/
│   ├── components/     # React 组件
│   ├── hooks/          # 自定义 Hook
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数（游戏逻辑）
│   ├── App.tsx         # 根组件
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式（含 Tailwind）
├── AGENTS.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 构建命令

```bash
# 安装依赖
npm install

# 开发模式启动（热重载）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run tsc

# 代码检查
npm run lint
```

## 游戏设计

### 核心机制

1. 游戏区域展示堆叠的汽车 Logo 牌堆
2. 玩家点击一张 Logo 牌，牌会进入底部"手牌槽"（最多 7 格）
3. 手牌槽中凑齐 3 张相同 Logo 自动消除
4. 手牌槽满且无法消除 → 游戏失败
5. 消除所有牌 → 游戏胜利

### 难度档位

| 难度 | 牌堆层数 | 品牌数量 | 时间限制 |
|------|----------|----------|----------|
| 简单 | 3 层     | 6 种     | 无       |
| 普通 | 5 层     | 10 种    | 120 秒   |
| 困难 | 7 层     | 16 种    | 90 秒    |

### Logo 图库

存放于 `public/logos/`，共 48 个品牌：
abarth, acura, alfa-romeo, aston-martin, audi, bentley, bmw, bugatti, buick, byd,
cadillac, chevrolet, chrysler, citroen, dacia, dodge, ferrari, fiat, ford, honda,
hyundai, jaguar, jeep, kia, lamborghini, lancia, land-rover, lexus, lincoln, lotus,
maserati, mazda, mclaren, mercedes-benz, mini, mitsubishi, nissan, opel, peugeot,
porsche, renault, rolls-royce, subaru, suzuki, tesla, toyota, volkswagen, volvo

## 代码规范

- 使用 TypeScript 严格模式，禁止 `any`
- 组件使用函数式组件 + Hooks
- 文件命名：组件用 PascalCase（`GameBoard.tsx`），工具用 camelCase（`gameLogic.ts`）
- 样式优先使用 Tailwind utility class，避免内联样式
- 游戏逻辑抽离到 `src/utils/` 或自定义 Hook，保持组件纯粹
- 提交信息格式：`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
