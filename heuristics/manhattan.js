function manhattan(state) {
    let distance = 0;
    for (let i = 0; i < 9; i++) {
        const val = state[i];
        if (val !== 0) {
            const goalRow = Math.floor((val - 1) / 3);
            const goalCol = (val - 1) % 3;
            const row = Math.floor(i / 3);
            const col = i % 3;
            distance += Math.abs(row - goalRow) + Math.abs(col - goalCol);
        }
    }
    return distance;
}