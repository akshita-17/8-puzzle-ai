function getNeighbors(board) {
    const moves = [];
    const index = board.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const directions = [[-1,0],[1,0],[0,-1],[0,1]];
    for (const [dr, dc] of directions) {
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < 3 && c >= 0 && c < 3) {
            const newIndex = r * 3 + c;
            const newBoard = [...board];
            newBoard[index] = newBoard[newIndex];
            newBoard[newIndex] = 0;
            moves.push(newBoard);
        }
    }
    return moves;
}

function reconstructPath(parent, current) {
    const path = [current];
    let key = current.join("");
    while (parent[key]) {
        current = parent[key];
        key = current.join("");
        path.unshift(current);
    }
    return path;
}

function shuffleBoard() {
    let board = [1,2,3,4,5,6,7,8,0];
    for (let i = 0; i < 200; i++) {
        const neighbors = getNeighbors(board);
        board = neighbors[Math.floor(Math.random() * neighbors.length)];
    }
    return board;
}

// For browser: expose as globals
if (typeof module !== 'undefined') {
    module.exports = { getNeighbors, reconstructPath, shuffleBoard };
}