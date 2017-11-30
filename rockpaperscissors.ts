function createRockPaperScissors(size: number): Rules {
    const allMoves = createMoves(size);
    return {
        nextMoves,
        getState,
        moves: allMoves
    };
    function createMoves(size: number): Map<string, number> {
        const moves = new Map<string, number>();
        for (let i = 0; i < size; i++) {
            moves.set(i.toString(), i);
        }
        return moves;
    }
    function nextMoves(node: Node): string[] {
        return Array.from(allMoves.keys());
    }
    function getState(node: Node): State {
        const history = getHistory(node);
        if (history.length === 0) return State.Undecided;
        if (history.length === 1) return State.Undecided;
        const whiteM = allMoves.get(history[Player.White]);
        const blackM = allMoves.get(history[Player.Black]);
        if (whiteM === undefined || blackM === undefined)
            throw new Error(`Player has made a move that does not exist.`);
        if ((whiteM + 1) % size === blackM) return State.White;
        if ((blackM + 1) % size === whiteM) return State.Black;
        return State.Draw;
    }
}
