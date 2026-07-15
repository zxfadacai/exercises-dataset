# Fitness Assistant Design System
# 基于 open-design 的 nike + energetic + bold 设计系统融合
# 结合 craft 规则：typography / color / anti-ai-slop

## 视觉主题与氛围
运动竞技感。深色基底 + 活力橙强调色，大胆的数字排版，
让用户感觉在用一块运动手表而非一个普通 App。

## 色彩

### 调色板分层（craft/color 规则）
| 层级 | 像素占比 | Token |
|---|---|---|
| 中性色 | 70-80% | --bg, --surface, --fg, --muted, --border |
| 强调色 | 5-10% | --accent (最多每屏2处可见) |
| 语义色 | 0-5% | --success, --warn, --danger |

### 暗色主题（默认）
- 背景: #0B0B0D (非纯黑，避免振动)
- 表面: #151518 (卡片/面板)
- 凸起: #1E1E22 (输入框/悬浮)
- 前景: #F2F2F5 (非纯白)
- 次要文字: #8B8B92
- 第三文字: #5A5A62
- 边框: rgba(255,255,255,0.08) (半透明白边，非实色暗边框)
- 强调: #00FF87 (活力橙)

### 亮色主题
- 背景: #F5F5F7
- 表面: #FFFFFF
- 凸起: #EEEEF0
- 前景: #111113
- 次要文字: #6B6B73
- 边框: rgba(0,0,0,0.08)

### 强调色纪律
- 每屏最多2处可见 accent：一个 CTA 按钮 + 一个焦点元素
- 标签/Chip 不用 accent，用中性色
- Hover/Focus 环算 accent 使用

## 字体

### 字体族
- 显示/标题: system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif
- 正文: 同上
- 数字/计时: ui-monospace, "SF Mono", "JetBrains Mono", monospace

### 字号阶梯（craft/typography 规则，1.25 比例）
| 角色 | 字号 | 行高 | 字间距 |
|---|---|---|---|
| Display | 40px | 1.0 | -0.03em |
| H1 | 28px | 1.1 | -0.02em |
| H2 | 22px | 1.2 | -0.01em |
| H3 | 18px | 1.3 | -0.01em |
| Body | 15px | 1.5 | 0 |
| Small | 13px | 1.5 | 0.01em |
| Caption | 11px | 1.4 | 0.02em |

### 大写文字
所有 ALL CAPS 文字必须 0.06em+ 正字间距

## 间距
4 / 8 / 12 / 16 / 20 / 24 / 32 / 48

## 圆角
- 小: 8px (标签/芯片)
- 中: 12px (卡片/输入)
- 大: 16px (面板/弹层)
- 全圆: 999px (按钮/头像)

## 组件

### 按钮
- 主按钮: accent 填充, 白字, 12px 圆角, 14px 32px 内边距, 600 字重
- 次按钮: 透明填充, 1px 边框, 前景色文字
- 按下: scale(0.97)
- 禁用: 0.35 透明度

### 卡片
- 表面色背景, 1px 半透明边框, 12px 圆角
- 无阴影（暗色主题用边框区分层级）
- 按下: 边框变为 accent

### 输入框
- 凸起色背景, 12px 圆角, 1px 边框
- 聚焦: accent 边框

### 底部导航
- 固定底部, 表面色背景, 上方 1px 半透明边框
- 激活项: accent 色
- 非激活: 第三文字色

## 反 AI 味检查（craft/anti-ai-slop）
1. 不用 indigo/紫色渐变
2. 不用 emoji 做功能图标 -- 用 SVG
3. 不用左边框彩色条 + 圆角的卡片
4. 不编造数据指标
5. 不用装饰性 blob/wave 背景
6. 80% 成熟模式 + 20% 特色选择
7. 特色选择: 计时器的大号等宽数字 + 橙色组数显示
