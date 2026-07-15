// 动作库视图

import { filter, getAll, getFilterOptions, getBodyPartCN, getEquipmentCN, getTargetCN, getDifficultyCN, assetPath } from "../exercise-data.js";
import { showDetail } from "./detail.js";
import { ICONS } from "../app.js";

export function renderLibrary(container) {
  const opts = getFilterOptions();
  let state = { keyword: "", bodyPart: "", homeOnly: false };

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">动作库</div>
      <div class="page-subtitle">1324个动作，搜索筛选</div>
    </div>
    <div class="search-bar">
      ${ICONS.search}
      <input type="text" id="libSearch" placeholder="搜索动作名称、部位...">
    </div>
    <div class="filter-chips" id="libChips">
      <button class="chip active" data-filter="all">全部</button>
      <button class="chip" data-filter="home">居家可用</button>
      <span style="width:1px;background:var(--border);margin:4px 0;flex-shrink:0"></span>
      ${opts.bodyParts.map(bp => `<button class="chip" data-filter="bodyPart" data-value="${bp}">${getBodyPartCN(bp)}</button>`).join("")}
    </div>
    <div id="libGrid" class="exercise-grid"></div>
  `;

  function updateGrid() {
    const results = filter(state);
    const grid = container.querySelector("#libGrid");
    if (results.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${ICONS.empty}<p>没有找到匹配的动作</p></div>`;
      return;
    }
    var showCount = Math.min(results.length, 100);
    grid.innerHTML = results.slice(0, showCount).map(ex => `
      <div class="exercise-card" data-id="${ex.id}">
        <div class="thumb">
          <img src="${assetPath(ex.image)}" loading="lazy" alt="${ex.name}" onerror="this.onerror=null;this.src='${assetPath(ex.image)}'">
          <div class="thumb-overlay">
            <div class="thumb-name">${ex.name}</div>
            <div class="thumb-tag">${getBodyPartCN(ex.body_part)}</div>
          </div>
        </div>
      </div>
    `).join("");

    grid.querySelectorAll(".exercise-card").forEach(card => {
      card.addEventListener("click", () => showDetail(card.dataset.id));
    });
    if (results.length > 100) {
      var more = document.createElement("div");
      more.style.cssText = "grid-column:1/-1;text-align:center;padding:16px;font-size:13px;color:var(--muted)";
      more.textContent = "?? " + (results.length - 100) + " ??????????????";
      grid.appendChild(more);
    }
  }

  let searchTimer = null;
  container.querySelector("#libSearch").addEventListener("input", (e) => {
    state.keyword = e.target.value;
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(updateGrid, 300);
  });

  container.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      if (f === "all") { state.homeOnly = false; state.bodyPart = ""; }
      else if (f === "home") { state.homeOnly = !state.homeOnly; }
      else if (f === "bodyPart") { state.bodyPart = state.bodyPart === chip.dataset.value ? "" : chip.dataset.value; }

      container.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      if (state.homeOnly) {
        container.querySelectorAll('.chip[data-filter="home"]').forEach(c => c.classList.add("active"));
      }
      if (state.bodyPart) {
        container.querySelectorAll('.chip[data-filter="bodyPart"][data-value="' + state.bodyPart + '"]').forEach(c => c.classList.add("active"));
      }
      if (!state.homeOnly && !state.bodyPart) {
        container.querySelectorAll('.chip[data-filter="all"]').forEach(c => c.classList.add("active"));
      }
      updateGrid();
    });
  });

  updateGrid();
}
