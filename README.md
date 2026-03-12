# 8-Puzzle AI Lab 🧩

A web-based interactive 8-puzzle game with AI solving capabilities. Play manually or watch intelligent algorithms solve the puzzle step-by-step.

## 🌐 Live Demo

**[https://eight-puzzle-ai-d31g.onrender.com](https://eight-puzzle-ai-d31g.onrender.com)**

> ⚠️ Hosted on Render free tier — may take ~30 seconds to wake up on first visit.

---

## 📌 About

The 8-puzzle is a classic AI problem where you slide numbered tiles on a 3×3 grid to reach the goal state. This project implements multiple search algorithms to solve it automatically, with a visual step-by-step playback and a live heuristic feedback panel.

Built as part of an Artificial Intelligence course assignment.

---

## ✨ Features

### 🎮 Manual Mode
- Click tiles to slide them into the empty space
- Live **timer** starts on your first move
- **Move counter** tracks how many moves you've made
- **Manhattan distance** updates in real time after every move
- Live **heuristic grid** — tiles glow green (correct position) or red (wrong position)
- **AI Finish** button — stuck? Let A* complete it for you
- Move log with timestamps

### 🤖 AI Solver Mode
- Choose from **3 algorithms**:
  - **BFS** — Breadth-First Search (guaranteed optimal path)
  - **DFS** — Depth-First Search (depth-limited to 50)
  - **A\*** — A* with Manhattan distance heuristic (optimal + fast)
- Displays **nodes explored**, **time taken**, and **steps** after solving
- Full **playback controls** — play, pause, step forward/backward, jump 10 steps
- Adjustable **animation speed**
- Progress bar showing solve playback

---

## 🧠 Algorithms

| Algorithm | Optimal | Strategy | Notes |
|-----------|---------|----------|-------|
| BFS | ✅ Yes | Level-by-level expansion | Explores many nodes, guarantees shortest path |
| DFS | ❌ No | Depth-first, limit 50 | Fast but path may not be shortest |
| A* | ✅ Yes | Heuristic-guided | Uses Manhattan distance, most efficient |

### Heuristics Used
- **Manhattan Distance** — sum of tile distances from their goal positions
- **Misplaced Tiles** — count of tiles not in their goal position (shown in live panel)

---

## 🗂️ Project Structure

```
8_puzzle_ai/
├── index.html              # Home / landing page
├── manual.html             # Manual gameplay page
├── ai.html                 # AI solver page
├── server.js               # Express backend (Node.js)
├── package.json
│
├── css/
│   └── style.css           # All styles
│
├── js/
│   ├── manual.js           # Manual mode logic (timer, moves, AI finish)
│   └── ai.js               # AI mode logic (solve, playback controls)
│
├── algorithms/
│   ├── bfs.js              # Breadth-First Search
│   ├── dfs.js              # Depth-First Search
│   └── astar.js            # A* Search
│
├── heuristics/
│   └── manhattan.js        # Manhattan distance heuristic
│
└── utils/
    ├── board.js            # getNeighbors, shuffleBoard, reconstructPath
    └── solvable.js         # Inversion count solvability check
```

---

## 🚀 Run Locally

**Prerequisites:** Node.js installed

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/8_puzzle_ai.git
cd 8_puzzle_ai

# 2. Install dependencies
npm install

# 3. Start the server
node server.js

# 4. Open in browser
# Go to http://localhost:5000
```

---

## 🔌 API Endpoints

The Express server exposes these routes (used internally by the frontend):

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/solve` | Solve a board with given algorithm |
| POST | `/continue` | Continue solving from current state using A* |
| GET | `/shuffle` | Get a new shuffled solvable board |
| POST | `/check` | Check if a board state is solvable |

> All algorithms also run **client-side in the browser** — the server is optional.

---

## 🛠️ Tech Stack

- **Frontend** — HTML, CSS, Vanilla JavaScript
- **Backend** — Node.js, Express
- **Fonts** — Syne, DM Mono (Google Fonts)
- **Hosting** — Render (free tier)

---

## 📸 Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page with navigation to both modes |
| `manual.html` | Play manually with timer, heuristics and AI assist |
| `ai.html` | Watch AI solve with algorithm selection and playback |

---

## 👨‍💻 Author

Made for an AI course assignment.  
Feel free to fork, star ⭐, or use as reference.
