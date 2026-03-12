function astar(start) {
    const goal = "123456780";
    const g = {};
    const parent = {};
    const open = [start];
    g[start.join("")] = 0;
    let nodes = 0;

    while (open.length) {
        open.sort((a, b) =>
            (g[a.join("")] + manhattan(a)) - (g[b.join("")] + manhattan(b))
        );

        const current = open.shift();
        const key = current.join("");
        nodes++;

        if (key === goal) {
            return { path: reconstructPath(parent, current), nodes };
        }

        for (const n of getNeighbors(current)) {
            const nKey = n.join("");
            const tentative = g[key] + 1;
            if (g[nKey] === undefined || tentative < g[nKey]) {
                g[nKey] = tentative;
                parent[nKey] = current;
                open.push(n);
            }
        }
    }
    return null;
}

if (typeof module !== 'undefined') module.exports = astar;