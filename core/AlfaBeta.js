class AlfaBeta {
    static VALOR_PIEZA = {
        'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
        'p': -100, 'n': -320, 'b': -330, 'r': -500, 'q': -900, 'k': -20000
    };

    static PST_PAWN = [
        0,5,5,-10,-10,5,5,0,
        5,10,10,0,0,10,10,5,
        0,0,0,20,20,0,0,0,
        5,5,10,25,25,10,5,5,
        10,10,20,30,30,20,10,10,
        20,20,30,35,35,30,20,20,
        50,50,50,50,50,50,50,50,
        0,0,0,0,0,0,0,0
    ];
    static PST_KNIGHT = [
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,0,5,5,0,-20,-40,
        -30,5,10,15,15,10,5,-30,
        -30,0,15,20,20,15,0,-30,
        -30,5,15,20,20,15,5,-30,
        -30,0,10,15,15,10,0,-30,
        -40,-20,0,0,0,0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50
    ];
    static PST_BISHOP = [
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,0,0,0,0,0,0,-10,
        -10,0,5,10,10,5,0,-10,
        -10,5,5,10,10,5,5,-10,
        -10,0,10,10,10,10,0,-10,
        -10,10,10,10,10,10,10,-10,
        -10,5,0,0,0,0,5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20
    ];
    static PST_ROOK = [
        0,0,0,5,5,0,0,0,
        5,10,10,10,10,10,10,5,
        -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5,
        0,0,0,5,5,0,0,0
    ];
    static PST_QUEEN = [
        -20,-10,-10,-5,-5,-10,-10,-20,
        -10,0,0,0,0,0,0,-10,
        -10,0,5,5,5,5,0,-10,
        -5,0,5,5,5,5,0,-5,
        0,0,5,5,5,5,0,-5,
        -10,5,5,5,5,5,0,-10,
        -10,0,5,0,0,0,0,-10,
        -20,-10,-10,-5,-5,-10,-10,-20
    ];
    static PST_KING_MG = [
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
        20,20,0,0,0,0,20,20,
        20,30,10,0,0,10,30,20
    ];
    static PST_KING_EG = [
        -50,-40,-30,-20,-20,-30,-40,-50,
        -30,-20,-10,0,0,-10,-20,-30,
        -30,-10,20,30,30,20,-10,-30,
        -30,-10,30,40,40,30,-10,-30,
        -30,-10,30,40,40,30,-10,-30,
        -30,-10,20,30,30,20,-10,-30,
        -30,-30,0,0,0,0,-30,-30,
        -50,-30,-30,-30,-30,-30,-30,-50
    ];

    constructor(estado, color, max_depth = 3) {
        this.estado = estado;
        this.color = color;
        this.max_depth = max_depth;
    }

    evaluar(estado) {
        const board = estado.tablero.tablero;
        let score = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const pieza = board[r][c];
                if (!pieza) continue;
                score += AlfaBeta.VALOR_PIEZA[pieza] ?? 0;
                const idx = r * 8 + c;
                const signo = (pieza === pieza.toUpperCase() && this.color === 'blanco') ||
                (pieza === pieza.toLowerCase() && this.color === 'negro') ? 1 : -1;
                const up = pieza.toUpperCase();
                if (up === 'P') score += signo * AlfaBeta.PST_PAWN[idx];
                else if (up === 'N') score += signo * AlfaBeta.PST_KNIGHT[idx];
                else if (up === 'B') score += signo * AlfaBeta.PST_BISHOP[idx];
                else if (up === 'R') score += signo * AlfaBeta.PST_ROOK[idx];
                else if (up === 'Q') score += signo * AlfaBeta.PST_QUEEN[idx];
                else if (up === 'K') score += signo * (this.esFinal(board) ? AlfaBeta.PST_KING_EG[idx] : AlfaBeta.PST_KING_MG[idx]);
            }
        }
        score += this.evalPeones(board);
        score += this.evalSeguridadRey(board);
        for (const [r,c] of [[3,3],[3,4],[4,3],[4,4]]) {
            const pieza = board[r][c];
            if (!pieza) continue;
            const signo = (pieza === pieza.toUpperCase() && this.color === 'blanco') ||
            (pieza === pieza.toLowerCase() && this.color === 'negro') ? 1 : -1;
            score += 20 * signo;
        }
        const mi_moves = this.estado.sucesores_para(this.color).length;
        const otro = this.color === 'blanco' ? 'negro' : 'blanco';
        const op_moves = this.estado.sucesores_para(otro).length;
        score += 10 * (mi_moves - op_moves);
        if (this.esFinal(board)) score += this.evalActividadRey(board);
        return score;
    }

    evalPeones(board) {
        let val = 0;
        const friendly = this.color === 'blanco' ? 'P' : 'p';
        const enemy = this.color === 'blanco' ? 'p' : 'P';
        for (let c = 0; c < 8; c++) {
            for (let r = 0; r < 8; r++) {
                if (board[r][c] === friendly) {
                    const cols = [c - 1, c + 1];
                    if (cols.every(c2 => !(0 <= c2 && c2 < 8 && board.some(row => row[c2] === friendly)))) {
                        val -= 15;
                    }
                    const ahead = this.color === 'blanco' ? [...Array(r).keys()].reverse() : Array.from({length:8-r-1},(_,i)=>r+1+i);
                    if (ahead.every(r2 => board[r2][c] !== enemy)) val += 20;
                }
            }
        }
        return val;
    }

    evalSeguridadRey(board) {
        let val = 0;
        const pawn = this.color === 'blanco' ? 'P' : 'p';
        const king = this.color === 'blanco' ? 'K' : 'k';
        let rk = null, ck = null;
        for (let r = 0; r < 8 && rk === null; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === king) { rk = r; ck = c; break; }
            }
        }
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const r2 = rk + dr, c2 = ck + dc;
                if (0 <= r2 && r2 < 8 && 0 <= c2 && c2 < 8 && board[r2][c2] === pawn) val += 1;
            }
        }
        return val;
    }

    esFinal(board) {
        let tot = 0;
        for (const row of board) {
            for (const p of row) {
                if (!p || p.toUpperCase() === 'K') continue;
                tot += Math.abs(AlfaBeta.VALOR_PIEZA[p] ?? 0);
            }
        }
        return tot < 2000;
    }

    evalActividadRey(board) {
        let val = 0;
        const king = this.color === 'blanco' ? 'K' : 'k';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === king) {
                    const dist = Math.abs(r - 3.5) + Math.abs(c - 3.5);
                    val += Math.trunc(20 - dist * 4);
                }
            }
        }
        return val;
    }

    AlfaBeta(estado, depth, alfa, beta, maximizar) {
        if (depth === 0 || estado.terminado()) return [this.evaluar(estado), null];
        let mejorJugada = null;
        if (maximizar) {
            let valor = -Infinity;
            for (const [sucesor, jugada] of estado.sucesores()) {
                const [puntos] = this.AlfaBeta(sucesor, depth - 1, alfa, beta, false);
                if (puntos > valor) { valor = puntos; mejorJugada = jugada; }
                alfa = Math.max(alfa, valor);
                if (alfa >= beta) break;
            }
            return [valor, mejorJugada];
        } else {
            let valor = Infinity;
            for (const [sucesor, jugada] of estado.sucesores()) {
                const [puntos] = this.AlfaBeta(sucesor, depth - 1, alfa, beta, true);
                if (puntos < valor) { valor = puntos; mejorJugada = jugada; }
                beta = Math.min(beta, valor);
                if (beta <= alfa) break;
            }
            return [valor, mejorJugada];
        }
    }

    hacerJugada() {
        const maximizar = this.estado.jugadorActual() === this.color;
        const [, jugada] = this.AlfaBeta(this.estado, this.max_depth, -Infinity, Infinity, maximizar);
        if (!jugada) return;
        const [f1, c1, f2, c2] = jugada;
        this.estado.jugada([f1, c1], [f2, c2]);
    }
}

export default AlfaBeta;