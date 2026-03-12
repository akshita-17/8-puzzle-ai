// ── State ──────────────────────────────────────────────
let board = [1,2,3,4,5,6,7,8,0];
let moves = 0;
let startTime = null;
let timerInterval = null;
let gameOver = false;
let aiRunning = false;
let aiInterval = null;

const GOAL = [1,2,3,4,5,6,7,8,0];

// ── Boot ───────────────────────────────────────────────
renderBoard();
updateHeuristic();

// ── Render Board ───────────────────────────────────────
function renderBoard(highlightIdx = -1) {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    board.forEach((num, index) => {
        const tile = document.createElement("div");
        tile.className = num === 0 ? "tile empty" : "tile";
        if (aiRunning) tile.classList.add("locked");
        tile.innerText = num === 0 ? "" : num;
        if (num !== 0 && !aiRunning) tile.onclick = () => moveTile(index);
        if (index === highlightIdx && num === 0) tile.classList.add("empty");
        boardDiv.appendChild(tile);
    });

    updateHeuristic();
    updateStats();
}

// ── Move a tile ─────────────────────────────────────────
function moveTile(index) {
    if (gameOver || aiRunning) return;
    const zero = board.indexOf(0);
    const row0 = Math.floor(zero / 3), col0 = zero % 3;
    const rowI = Math.floor(index / 3), colI = index % 3;
    const adjacent = Math.abs(row0 - rowI) + Math.abs(col0 - colI) === 1;
    if (!adjacent) return;

    // Start timer on first move
    if (!startTime) {
        startTime = Date.now();
        startTimer();
    }

    [board[index], board[zero]] = [board[zero], board[index]];
    moves++;
    logMove(board, moves);
    renderBoard(index);
    checkWin();
}

// ── Stats ──────────────────────────────────────────────
function updateStats() {
    document.getElementById("moves").innerText = moves;
    document.getElementById("manhattan").innerText = manhattan(board);
}

// ── Timer ──────────────────────────────────────────────
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById("timer").innerText = elapsed + "s";
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// ── Heuristic Visual ────────────────────────────────────
function updateHeuristic() {
    const grid = document.getElementById("heuristicGrid");
    if (!grid) return;
    grid.innerHTML = "";

    let misplaced = 0;
    let manDist = 0;

    board.forEach((val, i) => {
        const cell = document.createElement("div");
        cell.className = "h-cell";
        if (val === 0) {
            grid.appendChild(cell);
            return;
        }
        cell.innerText = val;
        const goalIdx = GOAL.indexOf(val);
        if (i === goalIdx) {
            cell.classList.add("correct");
        } else {
            cell.classList.add("wrong");
            misplaced++;
            manDist += Math.abs(Math.floor(i/3) - Math.floor(goalIdx/3)) +
                       Math.abs(i%3 - goalIdx%3);
        }
        grid.appendChild(cell);
    });

    const mis = document.getElementById("misplacedCount");
    const man = document.getElementById("manhattanCount");
    if (mis) mis.innerText = misplaced;
    if (man) man.innerText = manDist;
}

// ── Shuffle ─────────────────────────────────────────────
function shuffleBoard() {
    stopAI();
    gameOver = false;
    board = shuffleBoardUtil();
    moves = 0;
    startTime = null;
    stopTimer();
    document.getElementById("timer").innerText = "0s";
    renderBoard();
    logClear();
    log("Board shuffled — good luck!", "");
}

// Separate util so we don't name-clash with the utils/board.js function
function shuffleBoardUtil() {
    let b = [1,2,3,4,5,6,7,8,0];
    // do 300 random valid moves from goal — always solvable
    for (let i = 0; i < 300; i++) {
        const ns = getNeighbors(b);
        b = ns[Math.floor(Math.random() * ns.length)];
    }
    return b;
}

// ── Reset ──────────────────────────────────────────────
function resetBoard() {
    stopAI();
    gameOver = false;
    board = [1,2,3,4,5,6,7,8,0];
    moves = 0;
    startTime = null;
    stopTimer();
    document.getElementById("timer").innerText = "0s";
    renderBoard();
    logClear();
    log("Board reset.", "");
    document.getElementById("winOverlay").classList.remove("show");
}

// ── AI Finish ──────────────────────────────────────────
function aiFinish() {
    if (gameOver) return;
    if (JSON.stringify(board) === JSON.stringify(GOAL)) {
        showToast("Already solved!");
        return;
    }
    const result = astar(board);
    if (!result) { showToast("No solution found."); return; }
    log(`AI taking over — ${result.path.length} steps, ${result.nodes} nodes explored`, "ai");
    animateAI(result.path);
}

function animateAI(path) {
    aiRunning = true;
    let i = 0;
    aiInterval = setInterval(() => {
        board = path[i];
        renderBoard();
        const tile = document.querySelectorAll(".tile")[board.indexOf(0)];
        if (tile) tile.classList.add("ai-step");
        i++;
        if (i >= path.length) {
            clearInterval(aiInterval);
            aiRunning = false;
            renderBoard();
            checkWin();
        }
    }, 380);
}

function stopAI() {
    clearInterval(aiInterval);
    aiRunning = false;
}

// ── Win Check ──────────────────────────────────────────
function checkWin() {
    if (JSON.stringify(board) !== JSON.stringify(GOAL)) return;
    stopTimer();
    gameOver = true;
    const elapsed = startTime ? ((Date.now() - startTime) / 1000).toFixed(1) : "0";
    document.getElementById("winSub").innerText =
        `${moves} moves · ${elapsed}s · Manhattan distance: 0`;
    document.getElementById("winOverlay").classList.add("show");
    log(`Solved! ${moves} moves in ${elapsed}s`, "move");
}

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

function logMove(state, moveNum) {
    log(`Move ${moveNum}: [${state.join(", ")}]`, "move");
}

function logClear() {
    document.getElementById("log").innerHTML = "";
}

// ── Toast ──────────────────────────────────────────────
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
}