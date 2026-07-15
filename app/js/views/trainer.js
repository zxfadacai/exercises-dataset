// 训练执行器视图

import { assetPath } from "../exercise-data.js";
import { saveRecord } from "../store.js";
import { ICONS } from "../app.js";

export function startTrainer(plan) {
  let exerciseIdx = 0;
  let currentSet = 1;
  let phase = "exercise"; // exercise | rest | done
  let restTimer = 0;
  let timerInterval = null;
  let startTime = Date.now();
  let totalSets = plan.exercises.reduce((s, e) => s + e.sets, 0);
  let completedSets = 0;

  const overlay = document.createElement("div");
  overlay.className = "trainer";
  document.body.appendChild(overlay);

  function render() {
    if (phase === "done") {
      renderDone();
      return;
    }

    const ex = plan.exercises[exerciseIdx];
    if (!ex) { phase = "done"; renderDone(); return; }

    const progress = `${exerciseIdx + 1}/${plan.exercises.length}`;
    const overallProgress = Math.round((completedSets / totalSets) * 100);

    if (phase === "exercise") {
      overlay.innerHTML = `
        <div class="trainer-header">
          <button class="trainer-close">${ICONS.close}</button>
          <div class="trainer-progress">${progress}</div>
          <div style="width:28px"></div>
        </div>
        <div class="trainer-bar"><div class="trainer-bar-fill" style="width:${overallProgress}%"></div></div>
        <div class="trainer-body">
          <div class="trainer-gif"><img src="${assetPath(ex.gif)}" alt="${ex.name}"></div>
          <div class="trainer-name">${ex.name}</div>
          <div class="trainer-sets">${currentSet}/${ex.sets} 组</div>
          <div style="font-size:16px;color:var(--text-secondary)">${ex.reps}次 | 休息${ex.restLabel}</div>
          ${(ex.steps || []).length ? `
          <div style="width:100%;max-width:320px;margin-top:8px;padding:12px 16px;background:var(--bg-surface);border-radius:var(--radius-md);border:1px solid var(--border);text-align:left">
            <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-secondary)">动作要领</div>
            ${ex.steps.map((step, i) => '<div style="font-size:13px;line-height:1.6;color:var(--text-secondary);margin-bottom:4px"><span style="color:var(--accent);font-weight:700">' + (i+1) + '.</span> ' + step + '</div>').join("")}
          </div>` : ""}
        </div>
        <div class="trainer-controls">
          <button class="btn-secondary" id="prevBtn">${ICONS.back}</button>
          <button class="btn-primary" id="doneSetBtn">完成本组</button>
          <button class="btn-secondary" id="skipBtn">${ICONS.next}</button>
        </div>
      `;
      overlay.querySelector(".trainer-close").addEventListener("click", closeTrainer);
      overlay.querySelector("#doneSetBtn").addEventListener("click", completeSet);
      overlay.querySelector("#skipBtn").addEventListener("click", skipExercise);
      overlay.querySelector("#prevBtn").addEventListener("click", prevExercise);
    } else if (phase === "rest") {
      overlay.innerHTML = `
        <div class="trainer-header">
          <button class="trainer-close">${ICONS.close}</button>
          <div class="trainer-progress">休息中</div>
          <div style="width:28px"></div>
        </div>
        <div class="trainer-bar"><div class="trainer-bar-fill" style="width:${overallProgress}%"></div></div>
        <div class="trainer-body">
          <div class="rest-label">休息倒计时</div>
          <div class="timer-display" style="color:var(--accent)">${restTimer}</div>
          <div style="font-size:14px;color:var(--text-secondary)">下一个: ${exerciseIdx + 1 < plan.exercises.length ? plan.exercises[exerciseIdx + 1].name : "完成"}</div>
        </div>
        <div class="trainer-controls">
          <button class="btn-primary" id="skipRestBtn">跳过休息</button>
          <button class="btn-secondary" id="addRestBtn">+15秒</button>
        </div>
      `;
      overlay.querySelector(".trainer-close").addEventListener("click", closeTrainer);
      overlay.querySelector("#skipRestBtn").addEventListener("click", skipRest);
      overlay.querySelector("#addRestBtn").addEventListener("click", () => { restTimer += 15; });
    }
  }

  function completeSet() {
    const ex = plan.exercises[exerciseIdx];
    completedSets++;
    if (currentSet >= ex.sets) {
      // 本动作完成，进入休息然后下一个
      currentSet = 1;
      exerciseIdx++;
      if (exerciseIdx >= plan.exercises.length) {
        phase = "done";
        renderDone();
        return;
      }
    } else {
      currentSet++;
    }
    // 进入休息
    phase = "rest";
    restTimer = ex.rest;
    startTimer();
    render();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      restTimer--;
      const display = overlay.querySelector(".timer-display");
      if (display) display.textContent = restTimer;
      if (restTimer <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        phase = "exercise";
        render();
      }
    }, 1000);
  }

  function skipRest() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    phase = "exercise";
    render();
  }

  function skipExercise() {
    const ex = plan.exercises[exerciseIdx];
    completedSets += (ex.sets - currentSet + 1);
    currentSet = 1;
    exerciseIdx++;
    if (exerciseIdx >= plan.exercises.length) {
      phase = "done";
      renderDone();
      return;
    }
    phase = "rest";
    restTimer = plan.exercises[exerciseIdx].rest;
    startTimer();
    render();
  }

  function prevExercise() {
    if (exerciseIdx > 0) {
      exerciseIdx--;
      currentSet = 1;
      phase = "exercise";
      render();
    }
  }

  function renderDone() {
    const duration = Math.round((Date.now() - startTime) / 60000);
    overlay.innerHTML = `
      <div class="trainer-body" style="justify-content:center;gap:24px">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center">
          ${ICONS.check}
        </div>
        <div style="font-size:28px;font-weight:800;text-align:center">训练完成！</div>
        <div class="plan-stat" style="width:100%;max-width:300px">
          <div><div class="stat-val">${plan.exercises.length}</div><div class="stat-label">动作</div></div>
          <div><div class="stat-val">${duration}</div><div class="stat-label">分钟</div></div>
          <div><div class="stat-val">${completedSets}</div><div class="stat-label">完成组数</div></div>
        </div>
      </div>
      <div class="trainer-controls">
        <button class="btn-primary" id="finishBtn">完成</button>
      </div>
    `;
    overlay.querySelector("#finishBtn").addEventListener("click", async () => {
      await saveRecord({
        planGoal: plan.goalLabel,
        exerciseCount: plan.exercises.length,
        duration: duration,
        completedSets: completedSets,
      });
      overlay.remove();
    });
  }

  function closeTrainer() {
    if (timerInterval) clearInterval(timerInterval);
    overlay.remove();
  }

  render();
}
