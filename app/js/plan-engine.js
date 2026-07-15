// 训练计划生成引擎
// 根据用户输入（目标、器材、时长、水平、分化）生成可执行的训练计划

import { getAll, isHomeEquipment } from "./exercise-data.js";

// 训练目标配置
const GOALS = {
  fat_loss: {
    label: "减脂塑形",
    sets: 3, reps: "15-20", rest: 30, restLabel: "30秒",
    cardioMix: true,
  },
  muscle: {
    label: "增肌增力",
    sets: 4, reps: "8-12", rest: 90, restLabel: "90秒",
    cardioMix: false,
  },
  tone: {
    label: "紧致塑形",
    sets: 3, reps: "12-15", rest: 60, restLabel: "60秒",
    cardioMix: false,
  },
  fitness: {
    label: "体能提升",
    sets: 3, reps: "12-20", rest: 45, restLabel: "45秒",
    cardioMix: true,
  },
};

// 训练分化方案：每个方案定义一次训练要覆盖的肌肉群
const SPLITS = {
  full_body: {
    label: "全身训练",
    groups: [
      { bodyParts: ["chest", "shoulders"], targetCount: 1, label: "胸/肩" },
      { bodyParts: ["back"], targetCount: 1, label: "背" },
      { bodyParts: ["upper legs"], targetCount: 1, label: "腿" },
      { bodyParts: ["waist"], targetCount: 1, label: "核心" },
      { bodyParts: ["upper arms"], targetCount: 1, label: "手臂" },
    ],
  },
  upper_lower: {
    label: "上下分化",
    groups: [
      { bodyParts: ["chest", "shoulders", "upper arms"], targetCount: 2, label: "上肢推" },
      { bodyParts: ["back", "upper arms"], targetCount: 2, label: "上肢拉" },
      { bodyParts: ["upper legs", "lower legs"], targetCount: 2, label: "下肢" },
      { bodyParts: ["waist"], targetCount: 1, label: "核心" },
    ],
  },
  push_pull_leg: {
    label: "推拉腿",
    groups: [
      { bodyParts: ["chest", "shoulders", "upper arms"], targetCount: 2, label: "推日" },
      { bodyParts: ["back"], targetCount: 2, label: "拉日" },
      { bodyParts: ["upper legs", "waist"], targetCount: 2, label: "腿日" },
    ],
  },
};

// 每个动作预估时间（秒）：组数 * (动作时长 + 休息)
function estimateExerciseTime(sets, rest) {
  return sets * (40 + rest);
}

// 从动作池中按条件选取，优先选择复合动作
function pickFromPool(pool, bodyParts, count, difficulty) {
  let candidates = pool.filter(ex => bodyParts.includes(ex.body_part));

  // 按难度筛选：入门级只选1-2，中级选1-3，高级选1-3但优先3
  if (difficulty === 1) {
    candidates = candidates.filter(ex => ex.difficulty <= 2);
  }

  // 打乱顺序增加多样性
  candidates = shuffle(candidates);

  // 优先选择不同 target 的动作，避免重复
  const picked = [];
  const usedTargets = new Set();
  for (const ex of candidates) {
    if (picked.length >= count) break;
    if (!usedTargets.has(ex.target)) {
      picked.push(ex);
      usedTargets.add(ex.target);
    }
  }
  // 如果不够，补齐
  for (const ex of candidates) {
    if (picked.length >= count) break;
    if (!picked.includes(ex)) picked.push(ex);
  }

  return picked;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getGoalOptions() {
  return Object.entries(GOALS).map(([key, val]) => ({ key, label: val.label }));
}

export function getSplitOptions() {
  return Object.entries(SPLITS).map(([key, val]) => ({ key, label: val.label }));
}

/**
 * 生成训练计划
 * @param {Object} params - { goal, equipment[], duration, difficulty, split }
 */
export function generatePlan(params) {
  const { goal, equipment, duration, difficulty, split } = params;
  const goalCfg = GOALS[goal] || GOALS.tone;
  const splitCfg = SPLITS[split] || SPLITS.full_body;

  const allExercises = getAll();

  // 按器材过滤出可用动作池
  let pool = allExercises.filter(ex => equipment.includes(ex.equipment));

  // 如果池太小，放宽限制
  if (pool.length < 10) {
    pool = allExercises.filter(ex => isHomeEquipment(ex.equipment));
  }

 // 计算可用时间（秒）
  const totalSeconds = duration * 60;
  const perExerciseTime = estimateExerciseTime(goalCfg.sets, goalCfg.rest);
  const maxExercises = Math.floor(totalSeconds / perExerciseTime);

  // 从每个肌肉群组中选取动作
  let selected = [];
  const totalSlots = splitCfg.groups.reduce((sum, g) => sum + g.targetCount, 0);
  const exercisesPerGroup = Math.max(1, Math.floor(maxExercises / totalSlots));

  for (const group of splitCfg.groups) {
    const count = Math.min(group.targetCount * Math.ceil(exercisesPerGroup / group.targetCount), group.targetCount * 2);
    const picks = pickFromPool(pool, group.bodyParts, Math.min(count, maxExercises - selected.length), difficulty);
    selected.push(...picks);
  }

  // 如果有氧目标，加入有氧动作
  if (goalCfg.cardioMix) {
    const cardio = pool.filter(ex => ex.body_part === "cardio");
    if (cardio.length > 0 && selected.length < maxExercises) {
      selected.push(shuffle(cardio)[0]);
    }
  }

 // 限制总数
  selected = selected.slice(0, maxExercises);

  // 构建计划
  const plan = {
    goal,
    goalLabel: goalCfg.label,
    split,
    splitLabel: splitCfg.label,
    duration,
    difficulty,
    exercises: selected.map((ex, i) => ({
      order: i + 1,
      id: ex.id,
      name: ex.name,
      bodyPart: ex.body_part,
      target: ex.target,
      equipment: ex.equipment,
      image: ex.image,
      gif: ex.gif,
      sets: goalCfg.sets,
      reps: goalCfg.reps,
      rest: goalCfg.rest,
      restLabel: goalCfg.restLabel,
      steps: ex.steps,
    })),
    estimatedMinutes: Math.ceil((selected.length * perExerciseTime) / 60),
    createdAt: new Date().toISOString(),
  };

  return plan;
}

// 预设快捷计划
export function getQuickPlans() {
  return [
    {
      id: "home_full_15",
      title: "居家全身 15分钟",
      desc: "零器械，适合新手",
      icon: "home",
      params: { goal: "fat_loss", equipment: ["body weight"], duration: 15, difficulty: 1, split: "full_body" },
    },
    {
      id: "home_core_15",
      title: "核心燃脂 15分钟",
      desc: "专攻腹肌，自重训练",
      icon: "flame",
      params: { goal: "fat_loss", equipment: ["body weight"], duration: 15, difficulty: 1, split: "full_body" },
    },
    {
      id: "dumbbell_upper_30",
      title: "哑铃上肢 30分钟",
      desc: "一对哑铃练上半身",
      icon: "dumbbell",
      params: { goal: "muscle", equipment: ["dumbbell"], duration: 30, difficulty: 2, split: "upper_lower" },
    },
    {
      id: "home_full_30",
      title: "居家全身 30分钟",
      desc: "自重训练，中等强度",
      icon: "body",
      params: { goal: "tone", equipment: ["body weight"], duration: 30, difficulty: 2, split: "full_body" },
    },
  ];
}
