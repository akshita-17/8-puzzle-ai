function bfs(start) {
    const goal = "123456780";
    const queue = [start];
    const visited = new Set([start.join("")]);
    const parent = {};
    let nodes = 0;

    while (queue.length) {
        const current = queue.shift();
        const key = current.join("");
        nodes++;

        if (key === goal) {
            return { path: reconstructPath(parent, current), nodes };
        }

        for (const n of getNeighbors(current)) {
            const nKey = n.join("");
            if (!visited.has(nKey)) {
                visited.add(nKey);
                parent[nKey] = current;
                queue.push(n);
            }
        }
    }
    return null;
}

if (typeof module !== 'undefined') module.exports = bfs;