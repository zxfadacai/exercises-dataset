// 个人中心视图

import { getStats, getRecords, getSetting, setSetting } from "../store.js";
import { getAll } from "../exercise-data.js";
import { ICONS } from "../app.js";

export async function renderProfile(container) {
  const stats = await getStats();
  const records = await getRecords();
  const theme = await getSetting("theme");

  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${ICONS.body}</div>
      <div class="profile-name">健身达人</div>
    </div>
    <div class="stat-row">
      <div class="stat-card">
        <div class="num">${stats.thisWeek}</div>
        <div class="label">本周训练</div>
      </div>
      <div class="stat-card">
        <div class="num">${stats.totalSessions}</div>
        <div class="label">总训练次数</div>
      </div>
      <div class="stat-card">
        <div class="num">${stats.totalMinutes}</div>
        <div class="label">总训练分钟</div>
      </div>
    </div>
    <div style="padding:0 16px 8px"><div class="section-title" style="font-size:18px">最近训练</div></div>
    <div class="menu-list" style="margin-bottom:24px">
      ${records.length === 0 ? `
        <div class="empty-state" style="padding:32px">${ICONS.empty}<p>还没有训练记录</p><p style="font-size:12px;margin-top:4px">开始第一次训练吧</p></div>
      ` : records.slice(0, 10).map(r => `
        <div class="menu-item">
          <div style="flex:1">
            <div class="mi-text">${r.planGoal || "训练"}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">
              ${formatDate(r.date)} | ${r.exerciseCount}个动作 | ${r.duration}分钟
            </div>
          </div>
          ${ICONS.check}
        </div>
      `).join("")}
    </div>
    <div style="padding:0 16px 8px"><div class="section-title" style="font-size:18px">设置</div></div>
    <div class="menu-list">
      <button class="menu-item" id="themeToggle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
        <div class="mi-text">${theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}</div>
        <span class="mi-arrow">›</span>
      </button>
    </div>
    <div style="padding:24px 16px;text-align:center;font-size:12px;color:var(--dim)">
      健身助手 v1.0<br>动作数据 ${getAll().length}条 | MIT License
    </div>
  `;

  container.querySelector("#themeToggle").addEventListener("click", async () => {
    const current = await getSetting("theme");
    if (current === "light") {
      document.documentElement.removeAttribute("data-theme");
      await setSetting("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      await setSetting("theme", "light");
    }
    renderProfile(container);
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return Math.floor(diff / 60) + "分钟前";
  if (diff < 86400) return Math.floor(diff / 3600) + "小时前";
  if (diff < 604800) return Math.floor(diff / 86400) + "天前";
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
