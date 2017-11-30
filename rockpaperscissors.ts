namespace rpc {
    interface Rules {
        nextMoves: (node: Node) => number[];
        getState: (node: Node) => State;
        moves: number[];
    }
    interface Node {
        state: State | undefined;
        lastMove: number;
        parent: Node;
        children: Node[];
    }
    function lastMove(node: Node): number {
        return node.lastMove;
    }
    function getHistory(node: Node): number[] {
        let history: number[] = [];
        if (node.state === State.Start) return history;
        _getHistory(node);
        return history.reverse();

        function _getHistory(node: Node) {
            if (node.parent.state === State.Start) {
                history.push(lastMove(node));
                return;
            }
            history.push(lastMove(node));
            _getHistory(node.parent);
        }
    }
    function createRockPaperScissors(size: number): Rules {
        const allMoves = createMoves(size);
        return {
            nextMoves,
            getState,
            moves: allMoves
        };
        function createMoves(size: number): number[] {
            const moves: number[] = [];
            for (let i = 0; i < size; i++) {
                moves.push(i);
            }
            return moves;
        }
        function nextMoves(node: Node): number[] {
            return allMoves;
        }
        function getState(node: Node): State {
            const history = getHistory(node);
            if (history.length === 0) return State.Undecided;
            if (history.length === 1) return State.Undecided;
            const whiteM = history[Player.White];
            const blackM = history[Player.Black];
            if ((whiteM + 1) % size === blackM) return State.White;
            if ((blackM + 1) % size === whiteM) return State.Black;
            return State.Draw;
        }
    }
}
