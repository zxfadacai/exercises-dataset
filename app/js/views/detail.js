// 动作详情视图

import { getById, getBodyPartCN, getTargetCN, getEquipmentCN, getDifficultyCN, assetPath } from "../exercise-data.js";
import { ICONS } from "../app.js";

export function showDetail(id) {
  const ex = getById(id);
  if (!ex) return;

  const overlay = document.createElement("div");
  overlay.className = "detail-overlay";
  overlay.innerHTML = `
    <div class="detail-header">
      <button class="back-btn">${ICONS.back}</button>
      <h2>${ex.name}<span style="font-size:13px;font-weight:400;color:var(--text-secondary);display:block;margin-top:2px">${ex.name_en || ""}</span></h2>
    </div>
    <div class="detail-body">
      <div class="detail-gif"><img src="${assetPath(ex.gif)}" alt="${ex.name}"></div>
      <div class="detail-tags">
        <span class="detail-tag primary">${getBodyPartCN(ex.body_part)}</span>
        <span class="detail-tag primary">${getTargetCN(ex.target)}</span>
        <span class="detail-tag">${getEquipmentCN(ex.equipment)}</span>
        <span class="detail-tag">${getDifficultyCN(ex.difficulty)}</span>
      </div>
      ${(ex.steps || []).length ? `
      <div class="section-title" style="margin-top:20px">动作步骤</div>
      <div class="steps-list">
        ${ex.steps.map((step, i) => `
          <div class="step-item">
            <div class="step-num">${i + 1}</div>
            <div class="step-text">${step}</div>
          </div>
        `).join("")}
      </div>` : ""}
    </div>
  `;

  overlay.querySelector(".back-btn").addEventListener("click", () => overlay.remove());
  document.body.appendChild(overlay);
}
