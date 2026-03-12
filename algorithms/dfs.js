function dfs(start) {
    const goal = "123456780";
    // DFS with depth limit to avoid infinite paths
    const MAX_DEPTH = 50;
    const stack = [{ state: start, depth: 0 }];
    const visited = new Set([start.join("")]);
    const parent = {};
    let nodes = 0;

    while (stack.length) {
        const { state: current, depth } = stack.pop();
        const key = current.join("");
        nodes++;

        if (key === goal) {
            return { path: reconstructPath(parent, current), nodes };
        }

        if (depth >= MAX_DEPTH) continue;

        for (const n of getNeighbors(current)) {
            const nKey = n.join("");
            if (!visited.has(nKey)) {
                visited.add(nKey);
                parent[nKey] = current;
                stack.push({ state: n, depth: depth + 1 });
            }
        }
    }
    return null;
}

if (typeof module !== 'undefined') module.exports = dfs;