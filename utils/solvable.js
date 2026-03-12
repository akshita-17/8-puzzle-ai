function isSolvable(board) {
    let inv = 0;
    for (let i = 0; i < board.length; i++)
        for (let j = i + 1; j < board.length; j++)
            if (board[i] && board[j] && board[i] > board[j]) inv++;
    return inv % 2 === 0;
}
if (typeof module !== 'undefined') module.exports = { isSolvable };