<div align="center">

# 💪 Exercises Dataset

<p>
  <img src="videos/0025-EIeI8Vf.gif" width="120" alt="杠铃卧推" />
  <img src="videos/0043-qXTaZnJ.gif" width="120" alt="杠铃全蹲" />
  <img src="videos/0032-ila4NZS.gif" width="120" alt="杠铃硬拉" />
  <img src="videos/0652-lBDjFxJ.gif" width="120" alt="引体向上" />
  <img src="videos/0294-NbVPDMW.gif" width="120" alt="哑铃二头弯举" />
  <img src="videos/0334-DsgkuIt.gif" width="120" alt="哑铃侧平举" />
</p>

**一个开箱即用的健身动作数据集，收录 1,324 个动作--每个动作均配有动画 GIF、180×180 缩略图、分类、部位、器械、目标肌群数据，以及 9 种语言的分步说明（英语、西班牙语、意大利语、土耳其语、俄语、中文、印地语、波兰语、韩语）。**

[![Exercises](https://img.shields.io/badge/Exercises-1324-blue?style=flat-square)](data/exercises.json)
[![Animation GIFs](https://img.shields.io/badge/Animation%20GIFs-1324-brightgreen?style=flat-square)](videos/)
[![Thumbnails](https://img.shields.io/badge/Thumbnails-1324-orange?style=flat-square)](images/)
[![Languages](https://img.shields.io/badge/Languages-9-green?style=flat-square)](#-概览)
[![Mobile App](https://img.shields.io/badge/App-LogPress-111111?style=flat-square&logo=react)](https://github.com/hasaneyldrm/logpress-public)
[![License](https://img.shields.io/badge/License-MIT%20%2B%20media%20terms-blue?style=flat-square)](LICENSE)

</div>

> **📱 为 [LogPress](https://github.com/hasaneyldrm/logpress-public) 应用提供数据支持** -- 一款 AI 辅助训练记录器；本数据集是其动作数据层。正在开发自己的健身应用？直接接入你的后端即可。

---

## 📦 数据来源

**本仓库提供：**

- 1,324 个动作，含分类、部位、器械、目标肌群与辅助肌群数据
- 每个动作配有动画 GIF + 180×180 缩略图（媒体版权 © [Gym visual](https://gymvisual.com/) - 详见[许可协议](#-许可与使用)）
- 9 种语言的分步说明（🇬🇧 英语、🇪🇸 西班牙语、🇮🇹 意大利语、🇹🇷 土耳其语、🇷🇺 俄语、🇨🇳 中文、🇮🇳 印地语、🇵🇱 波兰语、🇰🇷 韩语）
- 交互式浏览器（`index.html`）和开发者设置指南（`setup.html`）

---

## 📋 目录

- [数据来源](#-数据来源)
- [概览](#-概览)
- [交互式浏览器与开发者设置](#-交互式浏览器与开发者设置)
- [文件结构](#-文件结构)
- [统计数据](#-统计数据)
- [数据结构](#-数据结构)
- [动作示例](#-动作示例)
- [使用示例](#-使用示例)
- [许可与使用](#-许可与使用)

---

## 🔍 概览

本数据集是一个精选的 **1,324 个健身动作**合集，供教育和研究用途。涵盖广泛的肌群、器械类型和动作分类--适用于：

- 开发健身或训练计划应用
- 涉及动作识别或推荐的机器学习项目
- 健康与运动科学研究
- 教学演示与原型开发

每个动作记录包含：

| 字段 | 说明 |
|---|---|
| 唯一 ID | 数字标识符（如 `"0001"`） |
| 名称 | 完整的动作名称 |
| 分类 | 主要训练部位 |
| 目标 | 具体目标肌肉 |
| 肌群 | 辅助 / 协同肌群 |
| 器械 | 所需器械（自重动作为 `body weight`） |
| 说明 | 每个动作的分步说明 |
| 支持语言 | 🇬🇧 英语 · 🇪🇸 西班牙语 · 🇮🇹 意大利语 · 🇹🇷 土耳其语 · 🇷🇺 俄语 · 🇨🇳 中文 · 🇮🇳 印地语 · 🇵🇱 波兰语 · 🇰🇷 韩语 |
| 媒体 | 每个动作的 180×180 缩略图（`image`）+ 动画 GIF（`gif_url`）- 媒体版权 © Gym visual，详见[许可协议](#-许可与使用) |

---
## 🖥️ 交互式浏览器与开发者设置

本仓库包含两个开箱即用的 HTML 工具--无需服务器，浏览器直接打开即可。

> **提示：** 浏览器会展示每个动作的 180×180 缩略图和动画 GIF，以及元数据和说明。

### `index.html` - 动作浏览器

一个完全前端实现的动作浏览器，功能包括：
- 对全部 1,324 个动作的实时搜索
- 按分类、器械、目标肌群筛选
- 无限滚动网格
- 点击任意卡片查看完整详情和说明（支持英语、西班牙语、意大利语、土耳其语、俄语、中文、印地语、波兰语、韩语）

### `setup.html` - 开发者设置指南

将数据集集成到你自己的应用的分步指南：

1. **数据库设置** - 提供 SQL Server、PostgreSQL、MySQL、SQLite 的 `CREATE TABLE` 语句。可在浏览器中直接生成包含全部 1,324 条 INSERT 语句的 `.sql` 文件。
2. **API 集成** - 提供 **JavaScript、Python、C#、Java、PHP、Go、cURL** 的客户端代码示例，展示如何调用你的后端 API。输入你的基础 URL，所有示例实时更新。
3. **AI 助手** - 一段结构化提示词（可选择你的框架和数据库），粘贴到 ChatGPT、Claude、Gemini 中即可一次性生成完整的、生产级 REST API。支持 Express.js、FastAPI、ASP.NET Core、Spring Boot、Laravel、Gin。

---

## 📂 文件结构

```
exercises-dataset/
├── data/
│   ├── exercises.json        # 完整数据集 - 1,324 条动作记录（JSON 数组）
│   └── exercises.schema.json # JSON Schema (2020-12) 描述每条记录
├── images/                  # 1,324 张 180×180 缩略图  (© Gym visual)
├── videos/                  # 1,324 个 180×180 动画 GIF  (© Gym visual)
├── index.html               # 交互式动作浏览器（纯前端，无需服务器）
├── setup.html               # 开发者设置指南（数据库导入 + API 集成）
├── NOTICE.md                # 媒体版权归属与许可条款
└── README.md
```

### 核心文件

- **`data/exercises.json`** - 主数据文件。一个包含 1,324 个动作对象的 JSON 数组，含全部元数据。`image` / `gif_url` 指向本地 180×180 资源，每条记录带有 `attribution` 字段；`media_id` 保存原始媒体引用 ID。
- **`data/exercises.schema.json`** - [JSON Schema](https://json-schema.org/)（Draft 2020-12），正式描述每个字段的类型和约束。可用于验证数据集或你自行添加的数据。
- **`images/`, `videos/`** - 180×180 缩略图和动画 GIF（© [Gym visual](https://gymvisual.com/)，经授权使用）。
- **`index.html`** - 独立动作浏览器。在任何现代浏览器中直接打开。
- **`setup.html`** - 开发者指南，包含数据库设置、API 集成和 AI 辅助后端生成。
- **`LICENSE`, `NOTICE.md`** - MIT（代码/数据）+ Gym visual 媒体使用条款。

---

## 📊 统计数据

| 指标 | 数量 |
|---|---|
| 动作总数 | **1,324** |
| 说明语言数 | **9** |

### 按部位统计

| 部位 | 动作数量 |
|---|---|
| 上臂 | 292 |
| 大腿 | 227 |
| 背部 | 203 |
| 腰部 | 169 |
| 胸部 | 163 |
| 肩部 | 143 |
| 小腿 | 59 |
| 前臂 | 37 |
| 有氧 | 29 |
| 颈部 | 2 |

### 按器械统计

| 器械 | 动作数量 |
|---|---|
| 自重 | 325 |
| 哑铃 | 294 |
| 绳索 | 157 |
| 杠铃 | 154 |
| 杠杆器械 | 81 |
| 弹力带 | 54 |
| 史密斯机 | 48 |
| 壶铃 | 41 |
| 负重 | 36 |
| 稳定球 | 28 |
| EZ杠铃 | 23 |
| 其他 | 83 |

> **提示：** 约 25% 的动作不需要任何器械--非常适合居家训练应用。

---
## 🗂️ 数据结构

`data/exercises.json` 中的每条记录遵循以下结构。同时提供了机器可读的 [JSON Schema](data/exercises.schema.json) 用于验证。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 唯一数字标识符（如 `"0001"`） |
| `name` | `string` | 完整动作名称（如 `"3/4 Sit-up"`） |
| `category` | `string` | 部位分类（如 `"upper arms"`、`"chest"`、`"back"`） |
| `body_part` | `string` | 同 `category` - 目标部位 |
| `equipment` | `string` | 所需器械（如 `"dumbbell"`、`"body weight"`） |
| `instructions.en` | `string` | 英语分步说明 |
| `instructions.es` | `string` | 西班牙语分步说明 |
| `instructions.it` | `string` | 意大利语分步说明 |
| `instructions.tr` | `string` | 土耳其语分步说明 |
| `instructions.ru` | `string` | 俄语分步说明 |
| `instructions.zh` | `string` | 中文分步说明 |
| `instructions.hi` | `string` | 印地语分步说明 |
| `instructions.pl` | `string` | 波兰语分步说明 |
| `instructions.ko` | `string` | 韩语分步说明 |
| `instruction_steps.<lang>` | `array[string]` | 同上说明按步骤拆分的有序数组，每种语言一组（`en`, `es`, `it`, `tr`, `ru`, `zh`, `hi`, `pl`, `ko`） |
| `muscle_group` | `string` | 主要协同肌群 |
| `secondary_muscles` | `array[string]` | 其他参与肌群 |
| `target` | `string` | 主要目标肌肉（如 `"biceps"`、`"pectoralis major"`） |
| `media_id` | `string` | 原始媒体引用 ID（如 `"2gPfomN"`） |
| `image` | `string` | 180×180 缩略图路径（如 `"images/0001-2gPfomN.jpg"`） |
| `gif_url` | `string` | 180×180 动画 GIF 路径（如 `"videos/0001-2gPfomN.gif"`） |
| `attribution` | `string` | 媒体版权声明 - `"© Gym visual - https://gymvisual.com/"` |
| `created_at` | `string` | 记录创建的 ISO 8601 时间戳 |

### 示例记录

```json
{
  "id": "0001",
  "name": "3/4 sit-up",
  "category": "waist",
  "body_part": "waist",
  "equipment": "body weight",
  "instructions": {
    "en": "Lie flat on your back with your knees bent and feet flat on the ground. Place your hands behind your head with your elbows pointing outwards. Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle. Pause for a moment at the top, then slowly lower your upper body back down to the starting position. Repeat for the desired number of repetitions.",
    "es": "Túmbate sobre tu espalda con las rodillas flexionadas y los pies apoyados en el suelo. ...",
    "it": "Sdraiati sulla schiena con le ginocchia piegate e i piedi appoggiati a terra. ...",
    "tr": "Sırt üstü yatın, dizlerinizi bükün ve ayaklarınızı yere düz koyun. ...",
    "ru": "Лягте на спину, согните колени и поставьте ступни на землю. ...",
    "zh": "平躺，膝盖弯曲，双脚平放在地上。...",
    "hi": "अपने घुटनों को मोड़कर और पैरों को ज़मीन पर सपाट रखते हुए अपनी पीठ के बल लेट जाएँ।...",
    "pl": "Połóż się płasko na plecach, ugnij kolana i oprzyj stopy płasko na pod ...",
    "ko": "등을 바닥에 누워 무릎을 구부리고 발을 바닥에 붙입니다. ..."
  },
  "muscle_group": "hip flexors",
  "secondary_muscles": ["hip flexors", "lower back"],
  "target": "abs",
  "media_id": "2gPfomN",
  "image": "images/0001-2gPfomN.jpg",
  "gif_url": "videos/0001-2gPfomN.gif",
  "attribution": "© Gym visual - https://gymvisual.com/",
  "created_at": "2026-03-18T12:31:32.854798+00:00"
}
```

---
## 🎬 动作示例

> 每个示例附带 180×180 缩略图（`image`）和动画 GIF（`gif_url`），© [Gym visual](https://gymvisual.com/)。

### 1 - 杠铃卧推 · 胸部

<img src="videos/0025-EIeI8Vf.gif" width="150" align="right" alt="杠铃卧推" />

> **器械：** 杠铃 · **目标：** 胸肌 · **辅助：** 肱三头肌、三角肌 · **媒体 ID：** `EIeI8Vf`

杠铃卧推是胸部训练的基石，也是力量举"三大项"之一。仰卧在平板上，将负重杠铃下放至胸部，然后爆发性推起。它同时募集胸肌、肱三头肌和前三角肌，是发展上肢推力和胸肌围度最有效的动作。

**要点：** 起杠前先收缩并下沉肩胛骨。双脚平踩地面，腰部自然拱起，握距与肩同宽。控制下放至胸部中段，通过脚跟发力推起。

### 2 - 杠铃硬拉 · 大腿 / 背部

<img src="videos/0032-ila4NZS.gif" width="150" align="right" alt="杠铃硬拉" />

> **器械：** 杠铃 · **目标：** 臀肌 · **辅助：** 腘绳肌、下背部 · **媒体 ID：** `ila4NZS`

杠铃硬拉被广泛认为是终极全身力量动作。它几乎募集后链的每一块主要肌肉--臀肌、腘绳肌和下背部--同时对上背部、斜方肌和握力有很高要求。正确的脊柱排列和核心支撑技术对表现和安全都至关重要。

**要点：** 杠铃置于脚掌中部正上方。屈髋俯身，握距略宽于腿，核心绷紧，整个拉起过程中杠铃贴紧胫骨。蹬地发力，顶部通过收缩臀肌完全伸展髋部。

### 3 - 杠铃全蹲 · 大腿

<img src="videos/0043-qXTaZnJ.gif" width="150" align="right" alt="杠铃全蹲" />

> **器械：** 杠铃 · **目标：** 臀肌 · **辅助：** 股四头肌、腘绳肌、小腿、核心 · **媒体 ID：** `qXTaZnJ`

常被称为"动作之王"的杠铃全蹲，需要整个下肢和核心的协调发力。蹲至大腿低于水平面能最大化臀肌和腘绳肌的激活，是几乎所有力量和增肌计划的基础。

**要点：** 杠铃放在上斜方肌（高杠）或后三角肌（低杠）上。下蹲前先支撑核心，膝盖与脚尖方向一致，臀部后坐，蹲至大腿低于水平面。通过全脚掌发力站起。

### 4 - 哑铃二头弯举 · 上臂

<img src="videos/0294-NbVPDMW.gif" width="150" align="right" alt="哑铃二头弯举" />

> **器械：** 哑铃 · **目标：** 肱二头肌 · **辅助：** 前臂 · **媒体 ID：** `NbVPDMW`

哑铃二头弯举是最广为人知的手臂孤立动作。两侧独立训练有助于发现和纠正肢体间的力量不平衡。旋前（掌心向上）握法能在动作顶点最大化肱二头肌的收缩。

**要点：** 站直，肘部紧贴体侧。上举时旋腕至掌心向上，顶部收缩，控制下放，避免借力摆动。不要用肩部或下背部产生惯性。

### 5 - 引体向上 · 背部

<img src="videos/0652-lBDjFxJ.gif" width="150" align="right" alt="引体向上" />

> **器械：** 自重 · **目标：** 背阔肌 · **辅助：** 肱二头肌、前臂 · **媒体 ID：** `lBDjFxJ`

引体向上是上肢拉力的黄金标准自重动作。主要发展背阔肌--打造倒三角体型--同时大量涉及肱二头肌、后三角肌和核心稳定肌群。可从初级（弹力带辅助）到高级（负重）进行进阶。

**要点：** 正握悬垂，握距与肩同宽或略宽。先下沉肩胛骨启动背阔肌，然后将胸部拉向单杠。每次动作之间完全放低，保持完整动作幅度。

### 6 - 哑铃侧平举 · 肩部

<img src="videos/0334-DsgkuIt.gif" width="150" align="right" alt="哑铃侧平举" />

> **器械：** 哑铃 · **目标：** 三角肌 · **辅助：** 斜方肌 · **媒体 ID：** `DsgkuIt`

哑铃侧平举是增加肩宽的首选孤立动作。直接刺激三角肌中束，这是塑造宽肩外观的关键。控制节奏和严格姿势远比重量重要。

**要点：** 全程保持肘部微屈。向两侧平举哑铃至手臂与地面平行--不要更高。以肘部引导，而非手腕。缓慢控制下放，最大化肌肉紧张时间。

---
## 🚀 使用示例

### Python - 加载与筛选

```python
import json

with open("data/exercises.json", "r", encoding="utf-8") as f:
    exercises = json.load(f)

print(f"Total exercises loaded: {len(exercises)}")

# Filter by category
chest_exercises = [ex for ex in exercises if ex["category"] == "chest"]
print(f"Chest exercises: {len(chest_exercises)}")
# -> Chest exercises: 163

# Filter by equipment
bodyweight = [ex for ex in exercises if ex["equipment"] == "body weight"]
print(f"Bodyweight exercises: {len(bodyweight)}")
# -> Bodyweight exercises: 325

# Get all unique categories
categories = sorted({ex["category"] for ex in exercises})
print("Categories:", categories)

# Access multilingual instructions
ex = exercises[0]
print(ex["instructions"]["en"])  # English
print(ex["instructions"]["es"])  # Spanish
print(ex["instructions"]["it"])  # Italian
print(ex["instructions"]["tr"])  # Turkish
print(ex["instructions"]["ru"])  # Russian
print(ex["instructions"]["zh"])  # Chinese
print(ex["instructions"]["hi"])  # Hindi
```

### Python - 使用 Pandas 加载

```python
import json
import pandas as pd

with open("data/exercises.json", "r", encoding="utf-8") as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Top categories by exercise count
print(df["category"].value_counts().head(10))

# All barbell exercises targeting upper legs
barbell_quads = df[(df["equipment"] == "barbell") & (df["category"] == "upper legs")]
print(barbell_quads[["name", "target", "equipment"]])
```

### JavaScript / Node.js

```js
const exercises = require("./data/exercises.json");

console.log(`Total exercises: ${exercises.length}`);

// Bodyweight exercises only
const bodyweight = exercises.filter(ex => ex.equipment === "body weight");
console.log(`Bodyweight exercises: ${bodyweight.length}`);
// -> Bodyweight exercises: 325

// Group exercises by category
const byCategory = exercises.reduce((acc, ex) => {
  acc[ex.category] = (acc[ex.category] || []);
  acc[ex.category].push(ex);
  return acc;
}, {});

// Access multilingual instructions
const ex = exercises[0];
console.log(ex.instructions.en); // English
console.log(ex.instructions.es); // Spanish
console.log(ex.instructions.it); // Italian
console.log(ex.instructions.tr); // Turkish
console.log(ex.instructions.ru); // Russian
console.log(ex.instructions.zh); // Chinese
console.log(ex.instructions.hi); // Hindi
console.log(ex.instructions.pl); // Polish
console.log(ex.instructions.ko); // Korean
```

### TypeScript - 类型安全用法

```typescript
interface Exercise {
  id: string;
  name: string;
  category: string;
  body_part: string;
  equipment: string;
  instructions: {
    en: string;
    es: string;
    it: string;
    tr: string;
    ru: string;
    zh: string;
    hi: string;
    pl: string;
    ko: string;
  };
  muscle_group: string;
  secondary_muscles: string[];
  target: string;
  media_id: string | null;
  image: string | null;
  gif_url: string | null;
  attribution: string;
  created_at: string;
}

import exercises from "./data/exercises.json";
const data = exercises as Exercise[];

const randomWorkout: Exercise[] = data.slice(0, 6);
console.log("First 6 exercises:", randomWorkout.map(e => e.name));
```

---
## 📄 许可与使用

本仓库是一个**开发者设置向导和结构化动作数据集**--包含动作元数据、多语言说明翻译，以及 180×180 动作媒体资源。

- **代码、工具、数据集结构和说明文本**基于 [MIT 许可证](LICENSE) 发布。
- **动作媒体资源（图片和 GIF）版权归 [Gym visual](https://gymvisual.com/) 所有**，经授权以 180×180 分辨率在本仓库中分发--详见 [`NOTICE.md`](NOTICE.md) 和 [`LICENSE`](LICENSE) 中的媒体例外条款。请保留 `© Gym visual - https://gymvisual.com/` 版权声明。媒体资源的再使用受 [Gym visual 使用条款](https://gymvisual.com/content/3-terms-and-conditions-of-use) 约束，再使用前请在该网站获取自己的授权。
- 本仓库**不**主张对底层动作内容或媒体资源拥有所有权。