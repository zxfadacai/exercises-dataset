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
  let exerciseSetProgress = plan.exercises.map(() => 0);
  let wakeLock = null;
  let saved = false; // 防止重复保存训练记录

  const overlay = document.createElement("div");
  overlay.className = "trainer";
  document.body.appendChild(overlay);

  // 复用同一个 GIF 容器，避免每次 phase 切换都重新加载动图
  const gifContainer = document.createElement("div");
  gifContainer.className = "trainer-gif";
  const gifImg = document.createElement("img");
  gifImg.alt = "";
  gifContainer.appendChild(gifImg);

  // 复用同一个 AudioContext，避免多次新建超过浏览器上限后无声
  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
    }
    return audioCtx;
  }

  async function requestWakeLock() {
    try { wakeLock = await navigator.wakeLock.request("screen"); } catch (_) {}
  }
  function releaseWakeLock() {
    if (wakeLock) { try { wakeLock.release(); wakeLock = null; } catch (_) {} }
  }
  // 页面回到前台时重新申请屏幕常亮（切后台/锁屏会自动释放）
  function onVisibility() {
    if (document.visibilityState === "visible" && phase !== "done") requestWakeLock();
  }
  document.addEventListener("visibilitychange", onVisibility);

  function playBeep() {
    const ctx = getAudio();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.25;
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (_) {}
  }

  function vibrate(pattern) {
    try { navigator.vibrate(pattern); } catch (_) {}
  }

  function render() {
    if (phase === "done") { renderDone(); return; }
    const ex = plan.exercises[exerciseIdx];
    if (!ex) { phase = "done"; renderDone(); return; }

    const progress = exerciseIdx + 1 + "/" + plan.exercises.length;
    const overallProgress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    if (phase === "exercise") {
      // 仅当动作变化时才更新 src，避免 GIF 从头重载闪烁
      if (gifImg.dataset.exerciseId !== String(ex.id)) {
        gifImg.src = assetPath(ex.gif);
        gifImg.alt = ex.name;
        gifImg.dataset.exerciseId = String(ex.id);
      }

      overlay.innerHTML = [
        '<div class="trainer-header">',
          '<button class="trainer-close">' + ICONS.close + '</button>',
          '<div class="trainer-progress">' + progress + '</div>',
          '<div style="width:28px"></div>',
        '</div>',
        '<div class="trainer-bar"><div class="trainer-bar-fill" style="width:' + overallProgress + '%"></div></div>',
        '<div class="trainer-body">',
          '<div class="trainer-gif-wrap"></div>',
          '<div class="trainer-name">' + ex.name + '</div>',
          '<div class="trainer-sets">' + currentSet + '/' + ex.sets + ' 组</div>',
          '<div style="font-size:16px;color:var(--muted)">' + ex.reps + '次 | 休息' + ex.restLabel + '</div>',
        '</div>',
        '<div class="trainer-controls">',
          '<button class="btn-secondary" id="prevBtn"' + (exerciseIdx === 0 ? ' disabled' : '') + '>' + ICONS.back + '</button>',
          '<button class="btn-primary" id="doneSetBtn">完成本组</button>',
          '<button class="btn-secondary" id="skipBtn">' + ICONS.next + '</button>',
        '</div>'
      ].join("");

      overlay.querySelector(".trainer-gif-wrap").appendChild(gifContainer);
      overlay.querySelector(".trainer-close").addEventListener("click", closeTrainer);
      overlay.querySelector("#doneSetBtn").addEventListener("click", completeSet);
      overlay.querySelector("#skipBtn").addEventListener("click", skipExercise);
      overlay.querySelector("#prevBtn").addEventListener("click", prevExercise);
    } else if (phase === "rest") {
      overlay.innerHTML = [
        '<div class="trainer-header">',
          '<button class="trainer-close">' + ICONS.close + '</button>',
          '<div class="trainer-progress">休息中</div>',
          '<div style="width:28px"></div>',
        '</div>',
        '<div class="trainer-bar"><div class="trainer-bar-fill" style="width:' + overallProgress + '%"></div></div>',
        '<div class="trainer-body">',
          '<div class="rest-label">休息倒计时</div>',
          '<div class="timer-display" style="color:var(--accent)">' + restTimer + '</div>',
          '<div style="font-size:14px;color:var(--muted)">下一个: ' + (exerciseIdx < plan.exercises.length ? plan.exercises[exerciseIdx].name : "完成") + '</div>',
        '</div>',
        '<div class="trainer-controls">',
          '<button class="btn-primary" id="skipRestBtn">跳过休息</button>',
          '<button class="btn-secondary" id="addRestBtn">+15秒</button>',
        '</div>'
      ].join("");
      overlay.querySelector(".trainer-close").addEventListener("click", closeTrainer);
      overlay.querySelector("#skipRestBtn").addEventListener("click", skipRest);
      overlay.querySelector("#addRestBtn").addEventListener("click", function() {
        restTimer += 15;
        var d = overlay.querySelector(".timer-display");
        if (d) d.textContent = restTimer;
      });
    }
  }

  function completeSet() {
    var ex = plan.exercises[exerciseIdx];
    completedSets++;
    exerciseSetProgress[exerciseIdx]++;
    playBeep();
    vibrate(100);
    if (currentSet >= ex.sets) {
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
    phase = "rest";
    restTimer = ex.rest;
    startTimer();
    render();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      restTimer--;
      var d = overlay.querySelector(".timer-display");
      if (d) d.textContent = restTimer;
      if (restTimer <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        phase = "exercise";
        playBeep();
        vibrate([100, 100, 100]);
        render();
      }
    }, 1000);
  }

  function skipRest() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    phase = "exercise";
    playBeep();
    render();
  }

  function skipExercise() {
    var ex = plan.exercises[exerciseIdx];
    var remaining = ex.sets - currentSet + 1;
    completedSets += remaining;
    exerciseSetProgress[exerciseIdx] += remaining;
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
    if (exerciseIdx === 0) return;
    completedSets -= exerciseSetProgress[exerciseIdx];
    exerciseSetProgress[exerciseIdx] = 0;
    exerciseIdx--;
    currentSet = exerciseSetProgress[exerciseIdx] + 1;
    phase = "exercise";
    render();
  }

  function renderDone() {
    var duration = Math.round((Date.now() - startTime) / 60000);
    overlay.innerHTML = [
      '<div class="trainer-body" style="justify-content:center;gap:24px">',
        '<div style="width:80px;height:80px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center">' + ICONS.check + '</div>',
        '<div style="font-size:28px;font-weight:800;text-align:center">训练完成！</div>',
        '<div class="plan-stat" style="width:100%;max-width:300px">',
          '<div><div class="stat-val">' + plan.exercises.length + '</div><div class="stat-label">动作</div></div>',
          '<div><div class="stat-val">' + duration + '</div><div class="stat-label">分钟</div></div>',
          '<div><div class="stat-val">' + completedSets + '</div><div class="stat-label">完成组数</div></div>',
        '</div>',
      '</div>',
      '<div class="trainer-controls">',
        '<button class="btn-primary" id="finishBtn">完成</button>',
      '</div>'
    ].join("");
    overlay.querySelector("#finishBtn").addEventListener("click", finishAndSave);
  }

  // 完成页无论点"完成"还是关闭按钮，都保存记录再退出
  async function finishAndSave() {
    if (saved) { cleanup(); return; }
    saved = true;
    var duration = Math.round((Date.now() - startTime) / 60000);
    try {
      await saveRecord({
        planGoal: plan.goalLabel,
        exerciseCount: plan.exercises.length,
        duration: duration,
        completedSets: completedSets,
      });
    } catch (_) {}
    cleanup();
  }

  function cleanup() {
    if (timerInterval) clearInterval(timerInterval);
    document.removeEventListener("visibilitychange", onVisibility);
    releaseWakeLock();
    overlay.remove();
  }

  function closeTrainer() {
    // 完成页关闭同样保存，避免误点 X 丢失记录
    if (phase === "done") { finishAndSave(); return; }
    if (!confirm("确定要放弃本次训练吗？进度将不会保存。")) return;
    cleanup();
  }

  requestWakeLock();
  render();
}
