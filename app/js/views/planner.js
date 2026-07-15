// 计划生成器视图

import { getAll, getBodyPartCN, getEquipmentCN, assetPath } from "../exercise-data.js";
import { generatePlan, getGoalOptions, getSplitOptions } from "../plan-engine.js";
import { savePlan } from "../store.js";
import { startTrainer } from "./trainer.js";
import { ICONS } from "../app.js";

let plannerState = { goal: "fat_loss", equipment: ["body weight"], duration: 30, difficulty: 1, split: "full_body" };

export function renderPlanner(container) {
  const goals = getGoalOptions();
  const splits = getSplitOptions();
  const allEquipment = [...new Set(getAll().map(ex => ex.equipment))].sort();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">定制计划</div>
      <div class="page-subtitle">选择目标、器材、时长，智能生成训练计划</div>
    </div>
    <div class="planner-section">
      <div class="planner-group">
        <div class="planner-label">训练目标</div>
        <div class="option-grid">
          ${goals.map(g => `<button class="option-btn ${g.key === plannerState.goal ? "selected" : ""}" data-goal="${g.key}">${g.label}</button>`).join("")}
        </div>
      </div>
      <div class="planner-group">
        <div class="planner-label">可用器材（可多选）</div>
        <div class="option-grid three">
          ${allEquipment.map(eq => `<button class="option-btn ${plannerState.equipment.includes(eq) ? "selected" : ""}" data-eq="${eq}" style="font-size:12px;padding:10px 4px">${getEquipmentCN(eq)}</button>`).join("")}
        </div>
      </div>
      <div class="planner-group">
        <div class="planner-label">训练时长</div>
        <div class="option-grid three">
          <button class="option-btn ${plannerState.duration===15?"selected":""}" data-dur="15">15分钟</button>
          <button class="option-btn ${plannerState.duration===30?"selected":""}" data-dur="30">30分钟</button>
          <button class="option-btn ${plannerState.duration===45?"selected":""}" data-dur="45">45分钟</button>
        </div>
      </div>
      <div class="planner-group">
        <div class="planner-label">训练水平</div>
        <div class="option-grid three">
          <button class="option-btn ${plannerState.difficulty===1?"selected":""}" data-diff="1">入门</button>
          <button class="option-btn ${plannerState.difficulty===2?"selected":""}" data-diff="2">中级</button>
          <button class="option-btn ${plannerState.difficulty===3?"selected":""}" data-diff="3">高级</button>
        </div>
      </div>
      <div class="planner-group">
        <div class="planner-label">训练分化</div>
        <div class="option-grid three">
          ${splits.map(s => `<button class="option-btn ${s.key === plannerState.split ? "selected" : ""}" data-split="${s.key}">${s.label}</button>`).join("")}
        </div>
      </div>
      <button class="generate-btn" id="genBtn">生成训练计划</button>
    </div>
    <div id="planResult"></div>
  `;

  // 绑定目标
  container.querySelectorAll("[data-goal]").forEach(btn => {
    btn.addEventListener("click", () => {
      plannerState.goal = btn.dataset.goal;
      container.querySelectorAll("[data-goal]").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // 绑定器材（多选）
  container.querySelectorAll("[data-eq]").forEach(btn => {
    btn.addEventListener("click", () => {
      const eq = btn.dataset.eq;
      if (plannerState.equipment.includes(eq)) {
        if (plannerState.equipment.length > 1) {
          plannerState.equipment = plannerState.equipment.filter(e => e !== eq);
          btn.classList.remove("selected");
        }
      } else {
        plannerState.equipment.push(eq);
        btn.classList.add("selected");
      }
    });
  });

  // 绑定时长
  container.querySelectorAll("[data-dur]").forEach(btn => {
    btn.addEventListener("click", () => {
      plannerState.duration = parseInt(btn.dataset.dur);
      container.querySelectorAll("[data-dur]").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // 绑定难度
  container.querySelectorAll("[data-diff]").forEach(btn => {
    btn.addEventListener("click", () => {
      plannerState.difficulty = parseInt(btn.dataset.diff);
      container.querySelectorAll("[data-diff]").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // 绑定分化
  container.querySelectorAll("[data-split]").forEach(btn => {
    btn.addEventListener("click", () => {
      plannerState.split = btn.dataset.split;
      container.querySelectorAll("[data-split]").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // 生成按钮
  container.querySelector("#genBtn").addEventListener("click", () => {
    const plan = generatePlan(plannerState);
    renderPlanView(container, plan);
  });
}

export function renderPlanView(container, plan) {
  const result = container.querySelector("#planResult") || container;
  result.innerHTML = `
    <div class="plan-summary">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:18px;font-weight:700">${plan.goalLabel} - ${plan.splitLabel}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">${plan.exercises.length}个动作 | 预计${plan.estimatedMinutes}分钟</div>
      </div>
      <div class="plan-stat">
        <div><div class="stat-val">${plan.exercises.length}</div><div class="stat-label">动作</div></div>
        <div><div class="stat-val">${plan.estimatedMinutes}</div><div class="stat-label">分钟</div></div>
        <div><div class="stat-val">${plan.exercises[0]?.sets || 3}</div><div class="stat-label">组数</div></div>
      </div>
    </div>
    <div style="background:var(--bg-surface);border-radius:var(--radius-lg);margin:0 16px 16px;border:1px solid var(--border);overflow:hidden" id="planList">
      ${plan.exercises.map((ex, i) => `
        <div class="plan-exercise">
          <div class="pe-num">${i + 1}</div>
          <div class="pe-thumb"><img src="${assetPath(ex.image)}" loading="lazy" alt="${ex.name}"></div>
          <div class="pe-info">
            <div class="pe-name">${ex.name}</div>
            <div class="pe-detail">${ex.sets}组 x ${ex.reps}次 | 休息${ex.restLabel} | ${getBodyPartCN(ex.bodyPart)}</div>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="start-btn">
      <button id="startTrainBtn">开始训练</button>
    </div>
    <div style="padding:0 16px 20px;display:flex;gap:12px">
      <button class="option-btn" style="flex:1" id="savePlanBtn">保存计划</button>
      <button class="option-btn" style="flex:1" id="regenBtn">重新生成</button>
    </div>
  `;

  result.querySelector("#startTrainBtn").addEventListener("click", () => {
    startTrainer(plan);
  });

  result.querySelector("#savePlanBtn").addEventListener("click", async () => {
    await savePlan(plan);
    const btn = result.querySelector("#savePlanBtn");
    btn.textContent = "已保存";
    btn.style.borderColor = "var(--accent)";
    btn.style.color = "var(--accent)";
  });

  result.querySelector("#regenBtn").addEventListener("click", () => {
    const newPlan = generatePlan(plannerState);
    renderPlanView(container, newPlan);
  });

  result.scrollIntoView({ behavior: "smooth" });
}
