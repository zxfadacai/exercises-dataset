// 鍔ㄤ綔鏁版嵁鍔犺浇涓庢煡璇?
let _data = null;
let _filtered = [];

// 鍣ㄦ潗涓枃鏄犲皠
const EQUIPMENT_CN = {
  "body weight": "鑷噸",
  "dumbbell": "鍝戦搩",
  "barbell": "鏉犻搩",
  "cable": "缁崇储",
  "kettlebell": "澹堕搩",
  "band": "寮瑰姏甯?,
  "resistance band": "寮瑰姏甯?,
  "leverage machine": "鍣ㄦ",
  "smith machine": "鍙插瘑鏂?,
  "stability ball": "鐟滀冀鐞?,
  "medicine ball": "鑽悆",
  "ez barbell": "EZ鏉?,
  "foam roll": "娉℃搏杞?,
  "roller": "娉℃搏杞?,
  "rope": "璺崇怀",
  "bosu ball": "BOSU鐞?,
  "wheel roller": "鍋ヨ吂杞?,
  "weighted": "璐熼噸",
  "assisted": "杈呭姪",
  "sled machine": "闆﹪鏈?,
  "olympic barbell": "濂ヨ繍鏉犻搩",
  "trap bar": "鍏鏉?,
  "tire": "杞儙",
  "stepmill machine": "鍙伴樁鏈?,
  "elliptical machine": "妞渾鏈?,
  "hammer": "閿ゅ瓙",
  "skierg machine": "婊戦洩鏈?,
  "stationary bike": "鍔ㄦ劅鍗曡溅",
  "upper body ergometer": "涓婅偄娴嬪姛璁?,
};

// 閮ㄤ綅涓枃鏄犲皠
const BODYPART_CN = {
  "back": "鑳岄儴",
  "cardio": "鏈夋哀",
  "chest": "鑳搁儴",
  "lower arms": "鍓嶈噦",
  "lower legs": "灏忚吙",
  "neck": "棰堥儴",
  "shoulders": "鑲╅儴",
  "upper arms": "涓婅噦",
  "upper legs": "澶ц吙",
  "waist": "鏍稿績",
};

// 鐩爣鑲岃倝涓枃鏄犲皠
const TARGET_CN = {
  "abs": "鑵硅倢",
  "pectorals": "鑳歌倢",
  "biceps": "浜屽ご鑲?,
  "triceps": "涓夊ご鑲?,
  "glutes": "鑷€鑲?,
  "delts": "涓夎鑲?,
  "upper back": "涓婅儗",
  "lats": "鑳岄様鑲?,
  "calves": "灏忚吙",
  "quads": "鑲″洓澶磋倢",
  "forearms": "鍓嶈噦",
  "cardiovascular system": "蹇冭偤",
  "hamstrings": "鑵樼怀鑲?,
  "spine": "鑴婃煴",
  "traps": "鏂滄柟鑲?,
  "adductors": "鍐呮敹鑲?,
  "abductors": "澶栧睍鑲?,
  "serratus anterior": "鍓嶉敮鑲?,
  "levator scapulae": "鑲╄儧鎻愯倢",
};

// 灞呭鍙敤鍣ㄦ潗闆嗗悎
const HOME_EQUIPMENT = [
  "body weight", "dumbbell", "kettlebell", "band", "resistance band",
  "stability ball", "medicine ball", "foam roll", "roller",
  "bosu ball", "rope", "wheel roller", "ez barbell"
];

// 闅惧害鏄犲皠
const DIFFICULTY_CN = { 1: "鍏ラ棬", 2: "涓骇", 3: "楂樼骇" };

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
  return DIFFICULTY_CN[d] || "涓骇";
}

export function isHomeEquipment(eq) {
  return HOME_EQUIPMENT.includes(eq);
}

// 鎸夋潯浠剁瓫閫?export function filter({ keyword = "", bodyPart = "", equipment = "", target = "", homeOnly = false } = {}) {
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

// 鑾峰彇绛涢€夐€夐」
export function getFilterOptions() {
  if (!_data) return { bodyParts: [], equipment: [], targets: [] };
  const bodyParts = [...new Set(_data.map(ex => ex.body_part))].sort();
  const equipment = [...new Set(_data.map(ex => ex.equipment))].sort();
  const targets = [...new Set(_data.map(ex => ex.target))].sort();
  return { bodyParts, equipment, targets };
}
// 图片路径修正：直接返回路径（图片已移入 app 目录）
export function assetPath(path) {
  if (!path) return "";
  return path;
}
