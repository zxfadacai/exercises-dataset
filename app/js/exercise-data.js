// 动作数据加载与查询

let _data = null;
let _filtered = [];

// 器材中文映射
const EQUIPMENT_CN = {
  "body weight": "自重",
  "dumbbell": "哑铃",
  "barbell": "杠铃",
  "cable": "绳索",
  "kettlebell": "壶铃",
  "band": "弹力带",
  "resistance band": "弹力带",
  "leverage machine": "器械",
  "smith machine": "史密斯",
  "stability ball": "瑜伽球",
  "medicine ball": "药球",
  "ez barbell": "EZ杆",
  "foam roll": "泡沫轴",
  "roller": "泡沫轴",
  "rope": "跳绳",
  "bosu ball": "BOSU球",
  "wheel roller": "健腹轮",
  "weighted": "负重",
  "assisted": "辅助",
  "sled machine": "雪橇机",
  "olympic barbell": "奥运杠铃",
  "trap bar": "六角杠",
  "tire": "轮胎",
  "stepmill machine": "台阶机",
  "elliptical machine": "椭圆机",
  "hammer": "锤子",
  "skierg machine": "滑雪机",
  "stationary bike": "动感单车",
  "upper body ergometer": "上肢测功计",
};

// 部位中文映射
const BODYPART_CN = {
  "back": "背部",
  "cardio": "有氧",
  "chest": "胸部",
  "lower arms": "前臂",
  "lower legs": "小腿",
  "neck": "颈部",
  "shoulders": "肩部",
  "upper arms": "上臂",
  "upper legs": "大腿",
  "waist": "核心",
};

// 目标肌肉中文映射
const TARGET_CN = {
  "abs": "腹肌",
  "pectorals": "胸肌",
  "biceps": "二头肌",
  "triceps": "三头肌",
  "glutes": "臀肌",
  "delts": "三角肌",
  "upper back": "上背",
  "lats": "背阔肌",
  "calves": "小腿",
  "quads": "股四头肌",
  "forearms": "前臂",
  "cardiovascular system": "心肺",
  "hamstrings": "腘绳肌",
  "spine": "脊柱",
  "traps": "斜方肌",
  "adductors": "内收肌",
  "abductors": "外展肌",
  "serratus anterior": "前锯肌",
  "levator scapulae": "肩胛提肌",
};

// 居家可用器材集合
const HOME_EQUIPMENT = [
  "body weight", "dumbbell", "kettlebell", "band", "resistance band",
  "stability ball", "medicine ball", "foam roll", "roller",
  "bosu ball", "rope", "wheel roller", "ez barbell"
];

// 难度映射
const DIFFICULTY_CN = { 1: "入门", 2: "中级", 3: "高级" };

export async function loadData() {
  if (_data) return _data;
  const res = await fetch("data/exercises-zh.min.json");
  _data = await res.json();
  _filtered = [..._data];
  return _data;
}

export function getAll() {
  return _data || [];
}

export function getEquipmentCN(eq) {
  return EQUIPMENT_CN[eq] || eq;
}

export function getBodyPartCN(bp) {
  return BODYPART_CN[bp] || bp;
}

export function getTargetCN(t) {
  return TARGET_CN[t] || t;
}

export function getDifficultyCN(d) {
  return DIFFICULTY_CN[d] || "中级";
}

export function isHomeEquipment(eq) {
  return HOME_EQUIPMENT.includes(eq);
}

// 按条件筛选
export function filter({ keyword = "", bodyPart = "", equipment = "", target = "", homeOnly = false } = {}) {
  if (!_data) return [];
  let result = _data;

  if (homeOnly) {
    result = result.filter(ex => HOME_EQUIPMENT.includes(ex.equipment));
  }
  if (bodyPart) {
    result = result.filter(ex => ex.body_part === bodyPart);
  }
  if (equipment) {
    result = result.filter(ex => ex.equipment === equipment);
  }
  if (target) {
    result = result.filter(ex => ex.target === target);
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    result = result.filter(ex =>
      ex.name.toLowerCase().includes(kw) ||
      getBodyPartCN(ex.body_part).includes(keyword) ||
      getTargetCN(ex.target).includes(keyword) ||
      getEquipmentCN(ex.equipment).includes(keyword)
    );
  }

  _filtered = result;
  return result;
}

export function getById(id) {
  if (!_data) return null;
  return _data.find(ex => ex.id === id);
}

// 获取筛选选项
export function getFilterOptions() {
  if (!_data) return { bodyParts: [], equipment: [], targets: [] };
  const bodyParts = [...new Set(_data.map(ex => ex.body_part))].sort();
  const equipment = [...new Set(_data.map(ex => ex.equipment))].sort();
  const targets = [...new Set(_data.map(ex => ex.target))].sort();
  return { bodyParts, equipment, targets };
}

// 图片路径修正：相对于 app 目录，需要回退一层访问 images/videos
export function assetPath(path) {
  if (!path) return "";
  return path;
}
