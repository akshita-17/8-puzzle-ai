// ── State ──────────────────────────────────────────────
let board = [1,2,3,4,5,6,7,8,0];
let selectedAlgo = "astar";
let playbackSolution = null;
let playbackIdx = 0;
let playbackPlaying = false;
let playbackTimer = null;
let playbackSpeed = 350;
let initialSnap = null;

const GOAL = [1,2,3,4,5,6,7,8,0];

// ── Boot ───────────────────────────────────────────────
renderBoard();

// ── Render Board ───────────────────────────────────────
function renderBoard(aiIdx = -1) {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board.forEach((num, index) => {
        const tile = document.createElement("div");
        tile.className = (num === 0 ? "tile empty" : "tile") + " locked";
        if (index === aiIdx && num !== 0) tile.classList.add("ai-step");
        tile.innerText = num === 0 ? "" : num;
        boardDiv.appendChild(tile);
    });
}

// ── Solve ──────────────────────────────────────────────
function solve() {
    if (JSON.stringify(board) === JSON.stringify(GOAL)) {
        showToast("Already solved!");
        return;
    }
    stopPlayback();

    const algo = document.getElementById("algorithm").value;
    selectedAlgo = algo;

    log(`Running ${algo.toUpperCase()}...`, "ai");

    const t0 = performance.now();
    let result;
    if (algo === "bfs")   result = bfs(board);
    if (algo === "dfs")   result = dfs(board);
    if (algo === "astar") result = astar(board);
    const elapsed = (performance.now() - t0).toFixed(2);

    if (!result) {
        log("No solution found.", "warn");
        showToast("No solution found!");
        return;
    }

    document.getElementById("nodes").innerText = result.nodes;
    document.getElementById("time").innerText  = elapsed;
    document.getElementById("steps").innerText = result.path.length - 1;

    log(`Done — ${result.path.length - 1} moves, ${result.nodes} nodes, ${elapsed}ms`, "move");

    // Show chips on selected algo card
    const card = document.querySelector(`.algo-item[data-algo="${algo}"]`);
    if (card) {
        const chips = card.querySelector(".algo-chips");
        if (chips) {
            chips.innerHTML = `<span class="chip">${result.path.length - 1} steps</span><span class="chip">${result.nodes} nodes</span><span class="chip">${elapsed}ms</span>`;
            chips.classList.add("show");
        }
    }

    beginPlayback(result.path, algo);
}

// ── Playback ───────────────────────────────────────────
function beginPlayback(path, algo) {
    initialSnap = [...board];
    playbackSolution = path;
    playbackIdx = 0;
    playbackPlaying = false;
    document.getElementById("playbackPanel").classList.add("show");
    document.getElementById("pbName").innerText = algo.toUpperCase();
    document.getElementById("stopBtn").style.display = "";
    updatePbUI();
}

function updatePbUI() {
    const total = playbackSolution ? playbackSolution.length - 1 : 0;
    document.getElementById("pbCounter").innerText = `${playbackIdx} / ${total}`;
    document.getElementById("progressFill").style.width = total
        ? `${(playbackIdx / total) * 100}%` : "0%";
}

function pbStep(delta) {
    if (!playbackSolution) return;
    playbackIdx = Math.max(0, Math.min(playbackSolution.length - 1, playbackIdx + delta));
    board = [...playbackSolution[playbackIdx]];
    renderBoard();
    updatePbUI();
}

function togglePlay() {
    if (!playbackSolution) return;
    if (playbackPlaying) { pausePlayback(); return; }
    playbackPlaying = true;
    document.getElementById("pbPlayBtn").innerText = "⏸";
    document.getElementById("pbPlayBtn").classList.add("playing");
    playNext();
}

function playNext() {
    if (!playbackPlaying) return;
    if (playbackIdx >= playbackSolution.length - 1) {
        pausePlayback();
        setTimeout(() => {
            document.getElementById("winSub").innerText =
                `AI (${selectedAlgo.toUpperCase()}) solved it in ${playbackSolution.length - 1} steps.`;
            document.getElementById("winOverlay").classList.add("show");
        }, 300);
        return;
    }
    playbackIdx++;
    const prev = playbackSolution[playbackIdx - 1];
    board = [...playbackSolution[playbackIdx]];
    // Find which tile moved (the one that was 0 in prev becomes non-zero)
    const movedIdx = board.findIndex((v, i) => v !== 0 && prev[i] === 0);
    renderBoard(movedIdx);
    updatePbUI();
    log(`Step ${playbackIdx}: [${board.join(",")}]`, "ai");
    playbackTimer = setTimeout(playNext, playbackSpeed);
}

function pausePlayback() {
    playbackPlaying = false;
    clearTimeout(playbackTimer);
    document.getElementById("pbPlayBtn").innerText = "▶";
    document.getElementById("pbPlayBtn").classList.remove("playing");
}

function stopPlayback() {
    pausePlayback();
    playbackSolution = null;
    document.getElementById("playbackPanel").classList.remove("show");
    document.getElementById("stopBtn").style.display = "none";
}

function updateSpeed(v) {
    playbackSpeed = 1050 - parseInt(v);
    document.getElementById("speedLabel").innerText = playbackSpeed + "ms";
}

// ── Shuffle ─────────────────────────────────────────────
function shuffleBoard() {
    stopPlayback();
    let b = [1,2,3,4,5,6,7,8,0];
    for (let i = 0; i < 300; i++) {
        const ns = getNeighbors(b);
        b = ns[Math.floor(Math.random() * ns.length)];
    }
    board = b;
    renderBoard();
    clearChips();
    document.getElementById("nodes").innerText = "—";
    document.getElementById("time").innerText  = "—";
    document.getElementById("steps").innerText = "—";
    document.getElementById("winOverlay").classList.remove("show");
    log("Board shuffled.", "");
}

// ── Algorithm card selection ────────────────────────────
function selectAlgo(el) {
    document.querySelectorAll(".algo-item").forEach(a => a.classList.remove("selected"));
    el.classList.add("selected");
    document.getElementById("algorithm").value = el.dataset.algo;
}

function clearChips() {
    document.querySelectorAll(".algo-chips").forEach(c => {
        c.classList.remove("show");
        c.innerHTML = "";
    });
}

// ── Win / Close ─────────────────────────────────────────
function closeWin() {
    document.getElementById("winOverlay").classList.remove("show");
}

// ── Log ────────────────────────────────────────────────
function log(msg, type = "") {
    const logDiv = document.getElementById("log");
    const entry = document.createElement("div");
    entry.className = "log-entry" + (type ? " " + type : "");
    entry.innerText = `${new Date().toLocaleTimeString()} — ${msg}`;
    logDiv.insertBefore(entry, logDiv.firstChild);
    while (logDiv.children.length > 60) logDiv.removeChild(logDiv.lastChild);
}

// ── Toast ──────────────────────────────────────────────
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
}