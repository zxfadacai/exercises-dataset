// 首页视图

import { generatePlan, getQuickPlans } from "../plan-engine.js";
import { getStats } from "../store.js";
import { getAll, assetPath } from "../exercise-data.js";
import { ICONS } from "../app.js";
import { renderPlanView } from "./planner.js";

function renderProgressRing(percent, color, size = 80) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  
  return `
    <svg width="${size}" height="${size}" style="transform: rotate(-90deg)">
      <circle cx="${size/2}" cy="${size/2}" r="${radius}" 
              stroke="rgba(255,255,255,0.1)" stroke-width="${strokeWidth}" fill="none"/>
      <circle cx="${size/2}" cy="${size/2}" r="${radius}" 
              stroke="${color}" stroke-width="${strokeWidth}" fill="none"
              stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
              stroke-linecap="round" style="transition: stroke-dashoffset 0.5s ease"/>
    </svg>
  `;
}

export async function renderHome(container, switchTab) {
  var quickPlans = getQuickPlans();
  var stats = { thisWeek: 0, totalSessions: 0, totalMinutes: 0 };
  try { stats = await getStats(); } catch(e) {}

  var heroPlan = quickPlans[0];
  var heroPlanData = generatePlan(heroPlan.params);
  var heroImg = heroPlanData.exercises[0] ? assetPath(heroPlanData.exercises[0].gif) : "";

  container.innerHTML = `
    <div style="padding: 20px 20px 8px">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
        <div>
          <div style="font-size: 14px; color: var(--muted)">Good Morning</div>
          <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.02em">Let's Workout</div>
        </div>
        <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--accent-soft); display: flex; align-items: center; justify-content: center; border: 1px solid var(--accent-glow)">
          ${ICONS.dumbbell}
        </div>
      </div>

      <div class="glass-card" style="border-radius: var(--r-lg); padding: 20px; margin-bottom: 16px">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
          <div style="font-size: 16px; font-weight: 700">Today's Progress</div>
          <div style="display: flex; align-items: center; gap: 6px; color: var(--accent); font-size: 12px; font-weight: 600">
            <span style="width: 8px; height: 8px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite"></span>
            <span>Active</span>
          </div>
        </div>
        <div style="display: flex; justify-content: center; gap: 20px">
          <div style="text-align: center">
            <div style="position: relative; display: inline-block">
              ${renderProgressRing(Math.min(stats.thisWeek * 25, 100), "#00FF87", 70)}
              <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800">${stats.thisWeek}</div>
            </div>
            <div style="font-size: 11px; color: var(--muted); margin-top: 6px">Workouts</div>
          </div>
          <div style="text-align: center">
            <div style="position: relative; display: inline-block">
              ${renderProgressRing(Math.min(stats.totalMinutes, 100), "#60EFFF", 70)}
              <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800">${stats.totalMinutes}</div>
            </div>
            <div style="font-size: 11px; color: var(--muted); margin-top: 6px">Minutes</div>
          </div>
          <div style="text-align: center">
            <div style="position: relative; display: inline-block">
              ${renderProgressRing(Math.min(stats.totalSessions * 5, 100), "#FF4757", 70)}
              <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800">${stats.totalSessions}</div>
            </div>
            <div style="font-size: 11px; color: var(--muted); margin-top: 6px">Sessions</div>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-v2" style="background-image:url('${heroImg}')">
      <div class="hero-v2-overlay"></div>
      <div class="hero-v2-content">
        <div class="hero-v2-top">
          <span class="hero-v2-badge">今日推荐</span>
          <span class="hero-v2-meta">${heroPlanData.exercises.length}动作 | ${heroPlanData.estimatedMinutes}分钟</span>
        </div>
        <div class="hero-v2-bottom">
          <div class="hero-v2-title">${heroPlan.title}</div>
          <div class="hero-v2-desc">${heroPlan.desc}</div>
          <button class="hero-v2-btn" data-quick="${heroPlan.id}">
            ${ICONS.play}
            <span>开始训练</span>
          </button>
        </div>
      </div>
    </div>

    <div class="sec-head">
      <div class="sec-title">快速开始</div>
      <div class="sec-hint">滑动查看更多</div>
    </div>
    <div class="h-scroll-v2">
      ${quickPlans.slice(1).map((qp, i) => `
        <button class="hs-v2" data-quick="${qp.id}">
          <div class="hs-v2-num">${String(i + 2).padStart(2, "0")}</div>
          <div class="hs-v2-body">
            <div class="hs-v2-title">${qp.title}</div>
            <div class="hs-v2-desc">${qp.desc}</div>
          </div>
          <div class="hs-v2-arrow">›</div>
        </button>
      `).join("")}
    </div>

    <div class="sec-head">
      <div class="sec-title">探索</div>
    </div>
    <div class="exp-v2-list">
      <button class="exp-v2" data-action="planner">
        <div class="exp-v2-icon">${ICONS.dumbbell}</div>
        <div class="exp-v2-text">
          <div class="exp-v2-title">定制计划</div>
          <div class="exp-v2-sub">选目标、选器材，智能生成专属训练</div>
        </div>
        <svg class="exp-v2-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <button class="exp-v2" data-action="library">
        <div class="exp-v2-icon">${ICONS.search}</div>
        <div class="exp-v2-text">
          <div class="exp-v2-title">动作库</div>
          <div class="exp-v2-sub">1324个动作，按部位、器材等筛选</div>
        </div>
        <svg class="exp-v2-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  `;

  container.querySelectorAll("[data-quick]").forEach(btn => {
    btn.addEventListener("click", () => {
      var qp = quickPlans.find(q => q.id === btn.dataset.quick);
      if (qp) {
        var plan = generatePlan(qp.params);
        renderPlanView(container, plan);
      }
    });
  });

  container.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.action));
  });
}
