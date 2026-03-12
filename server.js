const express = require("express");
const cors = require("cors");
const path = require("path");

// Algorithms need helper functions — load utils first
const { getNeighbors, reconstructPath, shuffleBoard } = require("./utils/board");
const { isSolvable } = require("./utils/solvable");

// Inject helpers into global scope so algorithm files can use them
global.getNeighbors = getNeighbors;
global.reconstructPath = reconstructPath;

const { manhattan } = (() => {
    // inline so it's available for astar on server side too
    function manhattan(state) {
        let d = 0;
        for (let i = 0; i < 9; i++) {
            const v = state[i];
            if (v !== 0) {
                d += Math.abs(Math.floor(i/3) - Math.floor((v-1)/3)) +
                     Math.abs(i%3 - (v-1)%3);
            }
        }
        return d;
    }
    global.manhattan = manhattan;
    return { manhattan };
})();

const bfs   = require("./algorithms/bfs");
const dfs   = require("./algorithms/dfs");
const astar = require("./algorithms/astar");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));  // serve frontend files

const GOAL = [1,2,3,4,5,6,7,8,0];

app.post("/solve", (req, res) => {
    const { board, algorithm } = req.body;
    if (!isSolvable(board)) return res.json({ solvable: false });
    let result;
    if (algorithm === "bfs")   result = bfs(board);
    if (algorithm === "dfs")   result = dfs(board);
    if (algorithm === "astar") result = astar(board);
    res.json({ solvable: true, result });
});

app.post("/continue", (req, res) => {
    const result = astar(req.body.board);
    res.json(result);
});

app.get("/shuffle", (req, res) => {
    res.json(shuffleBoard());
});

app.post("/check", (req, res) => {
    res.json({ solvable: isSolvable(req.body.board) });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));