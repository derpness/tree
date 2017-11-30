enum State {
    White,
    Black,
    Draw,
    Undecided,
    Start
}

interface Node {
    state: State | undefined;
    lastMove: string;
    parent: Node;
    children: Node[];
}

interface Rules {
    nextMoves: (node: Node) => string[];
    getState: (node: Node) => State;
    moves: Map<string, number>;
}

function lastMove(node: Node): string {
    return node.lastMove;
}

function getHistory(node: Node): string[] {
    let history: string[] = [];
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

enum Player {
    White,
    Black,
    Undefined
}

function createTicTacToeRules(size: number, toWin: number): Rules {
    const width = size;
    const nToWin = toWin;
    const moves = createMoves(size);

    return {
        nextMoves,
        getState,
        moves
    };
    function createMoves(size: number): Map<string, number> {
        const moves = new Map<string, number>();
        for (let i = 0; i < size; i++) {
            moves.set(i.toString(), i);
        }
        return moves;
    }
    function nextMoves(node: Node): string[] {
        const history = getHistory(node);
        const nextMoves: string[] = [];
        moves.forEach((n, m) => {
            if (history.indexOf(m) === -1) nextMoves.push(m);
        });
        return nextMoves;
    }
    function getState(node: Node): State {
        const history = getHistory(node);
        const XMoves = history.filter((m, i) => i % 2 === 0);
        const OMoves = history.map(m => m);
        let board: Player[][];
        board = new Array(width);
        for (let k = 0; k < board.length; k++) {
            board[k] = new Array(width);
            for (let i = 0; i < board[k].length; i++) {
                board[k][i] = Player.Undefined;
            }
        }

        XMoves.forEach(m => {
            const n = moves.get(m);
            if (n === undefined)
                throw new Error(
                    `Player has made a move that does not exist. Move: "${m}".`
                );
            board[Math.floor(n / width)][n % width] = Player.Black;
        });
        OMoves.forEach(m => {
            const n = moves.get(m);
            if (n === undefined)
                throw new Error(
                    `Player has made a move that does not exist. Move: "${m}".`
                );
            board[Math.floor(n / width)][n % width] = Player.White;
        });

        if (history.length === 0) return State.Start;

        //check column
        board.forEach(r => {
            let OStreak = 0;
            let XStreak = 0;
            for (let i = 0; i < r.length; i++) {
                switch (r[i]) {
                    case Player.White:
                        OStreak++;
                        if (OStreak == nToWin) return State.White;
                        XStreak = 0;
                        break;
                    case Player.Black:
                        XStreak++;
                        if (XStreak == nToWin) return State.Black;
                        OStreak = 0;
                        break;
                    case Player.Undefined:
                        OStreak = 0;
                        XStreak = 0;
                        break;
                }
            }
        });

        //check row
        for (let k = 0; k < board.length; k++) {
            let OStreak = 0;
            let XStreak = 0;
            for (let i = 0; k < board[k].length; i++) {
                switch (board[i][k]) {
                    case Player.White:
                        OStreak++;
                        if (OStreak == nToWin) return State.White;
                        XStreak = 0;
                        break;
                    case Player.Black:
                        XStreak++;
                        if (XStreak == nToWin) return State.Black;
                        OStreak = 0;
                        break;
                    case Player.Undefined:
                        OStreak = 0;
                        XStreak = 0;
                        break;
                }
            }
        }

        // diagonas bottom left side
        for (let k = 0; k < board.length; k++) {
            let l = k;
            for (let i = 0; i < board[k].length; i++) {
                board[l][i] = l++;
            }
        }
    }
}
