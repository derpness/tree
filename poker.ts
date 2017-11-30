namespace Poker {
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
    function createPoker(size: number): Rules {
        const PASSIVE = -1,
            CALL = -2,
            BET = -3,
            RAISE = -4;
        const allMoves = createMoves(size);
        return {
            nextMoves,
            getState,
            moves: allMoves
        };
        function createMoves(cards: number): number[] {
            const moves: number[] = [];
            for (let i = 0; i < size; i++) {
                moves.push(i);
            }
            moves.push(PASSIVE);
            moves.push(CALL);
            moves.push(BET);
            moves.push(RAISE);
            return moves;
        }
        function nextMoves(node: Node): number[] {
            const history = getHistory(node);
            if (history.length === 0) return allMoves.filter(n => n > -1);
            if (history.length === 1)
                return allMoves.filter(n => n > -1 && n !== history[0]);
            if (history.pop() === PASSIVE) {
                return [PASSIVE, BET];
            }
            if (history.pop() === BET) {
                return [PASSIVE, CALL, RAISE];
            }
            if (history.pop() === RAISE) {
                return [PASSIVE, CALL];
            }
            return [];
        }
        function getState(node: Node): State {
            const history = getHistory(node);
            if (
                history[history.length - 1] === CALL ||
                (history[history.length - 1] === PASSIVE && history.length > 2)
            )
                return;
            else return State.Undecided;
        }
    }
}

// PASSIVE PASSIVE
// PASSIVE BET PASSIVE
// PASSIVE BET CALL
// PASSIVE BET RAISE PASSIVE
// PASSIVE BET RAISE CALL
// BET PASSIVE
// BET CALL
// BET RAISE PASSIVE
// BET RAISE CALL
