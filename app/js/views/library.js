// 鍔ㄤ綔搴撹鍥?

import { filter, getFilterOptions, getBodyPartCN, getEquipmentCN, getTargetCN, getDifficultyCN, assetPath } from "../exercise-data.js";
import { showDetail } from "./detail.js";
import { ICONS } from "../app.js";

export function renderLibrary(container) {
  const opts = getFilterOptions();
  let state = { keyword: "", bodyPart: "", homeOnly: false };

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">鍔ㄤ綔搴?/div>
      <div class="page-subtitle">1324涓姩浣滐紝鎼滅储绛涢€?/div>
    </div>
    <div class="search-bar">
      ${ICONS.search}
      <input type="text" id="libSearch" placeholder="鎼滅储鍔ㄤ綔鍚嶇О銆侀儴浣?..">
    </div>
    <div class="filter-chips" id="libChips">
      <button class="chip active" data-filter="all">鍏ㄩ儴</button>
      <button class="chip" data-filter="home">灞呭鍙敤</button>
      <span style="width:1px;background:var(--border);margin:4px 0;flex-shrink:0"></span>
      ${opts.bodyParts.map(bp => `<button class="chip" data-filter="bodyPart" data-value="${bp}">${getBodyPartCN(bp)}</button>`).join("")}
    </div>
    <div id="libGrid" class="exercise-grid"></div>
  `;

  function updateGrid() {
    const results = filter(state);
    const grid = container.querySelector("#libGrid");
    if (results.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${ICONS.empty}<p>娌℃湁鎵惧埌鍖归厤鐨勫姩浣?/p></div>`;
      return;
    }
    grid.innerHTML = results.slice(0, 100).map(ex => `
      <div class="exercise-card" data-id="${ex.id}">
        <div class="thumb">
          <img src="${assetPath(ex.image)}"  alt="${ex.name}">
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
  }

  container.querySelector("#libSearch").addEventListener("input", (e) => {
    state.keyword = e.target.value;
    updateGrid();
  });

  container.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      if (f === "all") { state.homeOnly = false; state.bodyPart = ""; }
      else if (f === "home") { state.homeOnly = !state.homeOnly; }
      else if (f === "bodyPart") { state.bodyPart = state.bodyPart === chip.dataset.value ? "" : chip.dataset.value; }

      container.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      if (f === "bodyPart" && state.bodyPart) chip.classList.add("active");
      else if (f === "home" && state.homeOnly) chip.classList.add("active");
      else if (f === "all" || (!state.homeOnly && !state.bodyPart)) {
        container.querySelector('.chip[data-filter="all"]').classList.add("active");
      }
      updateGrid();
    });
  });

  updateGrid();
}

