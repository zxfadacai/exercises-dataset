// ???????

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
  let gifImg = null;

  const overlay = document.createElement("div");
  overlay.className = "trainer";
  document.body.appendChild(overlay);

  // ?? GIF ?????? phase ???
  const gifContainer = document.createElement("div");
  gifContainer.className = "trainer-gif";
  const gifImgEl = document.createElement("img");
  gifImgEl.alt = "";
  gifContainer.appendChild(gifImgEl);
  gifImg = gifImgEl;

  async function requestWakeLock() {
    try { wakeLock = await navigator.wakeLock.request("screen"); } catch (_) {}
  }

  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
      // ?? GIF????????? src?
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
          '<div class="trainer-sets">' + currentSet + '/' + ex.sets + ' ?</div>',
          '<div style="font-size:16px;color:var(--muted)">' + ex.reps + '? | ??' + ex.restLabel + '</div>',
        '</div>',
        '<div class="trainer-controls">',
          '<button class="btn-secondary" id="prevBtn">' + ICONS.back + '</button>',
          '<button class="btn-primary" id="doneSetBtn">????</button>',
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
          '<div class="trainer-progress">???</div>',
          '<div style="width:28px"></div>',
        '</div>',
        '<div class="trainer-bar"><div class="trainer-bar-fill" style="width:' + overallProgress + '%"></div></div>',
        '<div class="trainer-body">',
          '<div class="rest-label">?????</div>',
          '<div class="timer-display" style="color:var(--accent)">' + restTimer + '</div>',
          '<div style="font-size:14px;color:var(--muted)">????' + (exerciseIdx < plan.exercises.length ? plan.exercises[exerciseIdx].name : "??") + '</div>',
        '</div>',
        '<div class="trainer-controls">',
          '<button class="btn-primary" id="skipRestBtn">????</button>',
          '<button class="btn-secondary" id="addRestBtn">+15?</button>',
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
        '<div style="font-size:28px;font-weight:800;text-align:center">?????</div>',
        '<div class="plan-stat" style="width:100%;max-width:300px">',
          '<div><div class="stat-val">' + plan.exercises.length + '</div><div class="stat-label">??</div></div>',
          '<div><div class="stat-val">' + duration + '</div><div class="stat-label">??</div></div>',
          '<div><div class="stat-val">' + completedSets + '</div><div class="stat-label">????</div></div>',
        '</div>',
      '</div>',
      '<div class="trainer-controls">',
        '<button class="btn-primary" id="finishBtn">??</button>',
      '</div>'
    ].join("");
    overlay.querySelector("#finishBtn").addEventListener("click", async function() {
      await saveRecord({
        planGoal: plan.goalLabel,
        exerciseCount: plan.exercises.length,
        duration: duration,
        completedSets: completedSets,
      });
      if (wakeLock) { try { wakeLock.release(); } catch (_) {} }
      overlay.remove();
    });
  }

  function closeTrainer() {
    if (phase === "done") {
      if (timerInterval) clearInterval(timerInterval);
      if (wakeLock) { try { wakeLock.release(); } catch (_) {} }
      overlay.remove();
      return;
    }
    if (!confirm("??????????????????????")) return;
    if (timerInterval) clearInterval(timerInterval);
    if (wakeLock) { try { wakeLock.release(); } catch (_) {} }
    overlay.remove();
  }

  requestWakeLock();
  render();
}
