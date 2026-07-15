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
      <h2>${ex.name}<span style="font-size:13px;font-weight:400;color:var(--muted);display:block;margin-top:2px">${ex.name_en || ""}</span></h2>
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

    function closeDetail() {
    overlay.style.animation = "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
    setTimeout(() => overlay.remove(), 300);
  }
  overlay.querySelector(".back-btn").addEventListener("click", closeDetail);
  // Add swipe down gesture support
  var touchStartY = 0;
  overlay.addEventListener("touchstart", function(e) {
    if (overlay.scrollTop === 0) touchStartY = e.touches[0].clientY;
  }, { passive: true });
  overlay.addEventListener("touchmove", function(e) {
    if (touchStartY && e.touches[0].clientY - touchStartY > 100) {
      touchStartY = 0;
      closeDetail();
    }
  }, { passive: true });
  document.body.appendChild(overlay);
}
