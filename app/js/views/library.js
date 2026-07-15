// 动作库视图

import { filter, getAll, getFilterOptions, getBodyPartCN, getEquipmentCN, getTargetCN, getDifficultyCN, assetPath } from "../exercise-data.js";
import { showDetail } from "./detail.js";
import { ICONS } from "../app.js";

// 模块级状态：切换 tab 离开再回来时保留搜索词与筛选条件
let libState = { keyword: "", bodyPart: "", homeOnly: false, shownCount: 100 };

export function renderLibrary(container) {
  const opts = getFilterOptions();

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">动作库</div>
      <div class="page-subtitle">${getAll().length}个动作，搜索筛选</div>
    </div>
    <div class="search-bar">
      ${ICONS.search}
      <input type="text" id="libSearch" placeholder="搜索动作名称、部位..." value="${libState.keyword}">
    </div>
    <div class="filter-chips" id="libChips">
      <button class="chip" data-filter="all">全部</button>
      <button class="chip" data-filter="home">居家可用</button>
      <span style="width:1px;background:var(--border);margin:4px 0;flex-shrink:0"></span>
      ${opts.bodyParts.map(bp => `<button class="chip" data-filter="bodyPart" data-value="${bp}">${getBodyPartCN(bp)}</button>`).join("")}
    </div>
    <div id="libGrid" class="exercise-grid"></div>
  `;

  function syncChipsActive() {
    container.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    if (libState.homeOnly) {
      container.querySelectorAll('.chip[data-filter="home"]').forEach(c => c.classList.add("active"));
    }
    if (libState.bodyPart) {
      container.querySelectorAll('.chip[data-filter="bodyPart"][data-value="' + libState.bodyPart + '"]').forEach(c => c.classList.add("active"));
    }
    if (!libState.homeOnly && !libState.bodyPart) {
      container.querySelectorAll('.chip[data-filter="all"]').forEach(c => c.classList.add("active"));
    }
  }

  function updateGrid() {
    const results = filter(libState);
    const grid = container.querySelector("#libGrid");
    syncChipsActive();
    if (results.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${ICONS.empty}<p>没有找到匹配的动作</p></div>`;
      return;
    }
    var showCount = Math.min(results.length, libState.shownCount);
    grid.innerHTML = results.slice(0, showCount).map(ex => `
      <div class="exercise-card" data-id="${ex.id}">
        <div class="thumb">
          <img src="${assetPath(ex.image)}" loading="lazy" alt="${ex.name}" onerror="this.onerror=null;this.src='${assetPath(ex.gif)}'">
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

    if (results.length > showCount) {
      var more = document.createElement("button");
      more.className = "load-more-btn";
      more.textContent = "加载更多（剩余 " + (results.length - showCount) + " 个）";
      more.addEventListener("click", function() {
        libState.shownCount += 100;
        updateGrid();
      });
      grid.appendChild(more);
    }
  }

  let searchTimer = null;
  container.querySelector("#libSearch").addEventListener("input", (e) => {
    libState.keyword = e.target.value;
    libState.shownCount = 100;
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(updateGrid, 300);
  });

  container.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      if (f === "all") { libState.homeOnly = false; libState.bodyPart = ""; }
      else if (f === "home") { libState.homeOnly = !libState.homeOnly; }
      else if (f === "bodyPart") { libState.bodyPart = libState.bodyPart === chip.dataset.value ? "" : chip.dataset.value; }
      libState.shownCount = 100;
      updateGrid();
    });
  });

  updateGrid();
}
