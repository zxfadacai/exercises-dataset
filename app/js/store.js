// 本地存储层：IndexedDB 封装，保存训练计划和训练记录

const DB_NAME = "fit-assistant";
const DB_VERSION = 1;

let _db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("plans")) {
        db.createObjectStore("plans", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("records")) {
        const store = db.createObjectStore("records", { keyPath: "id", autoIncrement: true });
        store.createIndex("date", "date");
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    };
  });
}

async function getDB() {
  if (!_db) _db = await openDB();
  return _db;
}

function tx(db, store, mode) {
  return db.transaction(store, mode).objectStore(store);
}

function promisify(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ===== 训练计划 =====
export async function savePlan(plan) {
  const db = await getDB();
  plan.createdAt = new Date().toISOString();
  return promisify(tx(db, "plans", "readwrite").add(plan));
}

export async function getPlans() {
  const db = await getDB();
  return promisify(tx(db, "plans", "readonly").getAll());
}

export async function deletePlan(id) {
  const db = await getDB();
  return promisify(tx(db, "plans", "readwrite").delete(id));
}

// ===== 训练记录 =====
export async function saveRecord(record) {
  const db = await getDB();
  record.date = new Date().toISOString();
  return promisify(tx(db, "records", "readwrite").add(record));
}

export async function getRecords() {
  const db = await getDB();
  const all = await promisify(tx(db, "records", "readonly").getAll());
  return all.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getStats() {
  const records = await getRecords();
  const totalSessions = records.length;
  const totalMinutes = records.reduce((sum, r) => sum + (r.duration || 0), 0);
  const totalExercises = records.reduce((sum, r) => sum + (r.exerciseCount || 0), 0);

  // 本周训练次数
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const thisWeek = records.filter(r => new Date(r.date) >= weekStart).length;

  return { totalSessions, totalMinutes, totalExercises, thisWeek };
}

// ===== 设置 =====
export async function getSetting(key) {
  const db = await getDB();
  const result = await promisify(tx(db, "settings", "readonly").get(key));
  return result ? result.value : null;
}

export async function setSetting(key, value) {
  const db = await getDB();
  return promisify(tx(db, "settings", "readwrite").put({ key, value }));
}
