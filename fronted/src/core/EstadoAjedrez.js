import { mover_valido } from './ComprobarMovFichas.js';
import Tablero from './Tablero.js';

class Estado {
    constructor(tablero) {
        this.tablero = tablero;
        this.turnoBlanco = true;
        this.turnoNegro = false;
    }

    jugadorActual() {
        return this.turnoBlanco ? 'blanco' : 'negro';
    }

    colorPieza(pieza) {
        if (!pieza) return null;
        return pieza === pieza.toUpperCase() ? 'blanco' : 'negro';
    }

    tipoPieza(pieza) {
        const letras = {
            'P': 'peon', 'N': 'caballo', 'B': 'alfil', 'R': 'torre', 'Q': 'reina', 'K': 'rey',
            'p': 'peon', 'n': 'caballo', 'b': 'alfil', 'r': 'torre', 'q': 'reina', 'k': 'rey'
        };
        return letras[pieza];
    }

    sucesores() {
        const lista = [];
        const jugador = this.jugadorActual();
        for (let fila = 0; fila < 8; fila++) {
            for (let col = 0; col < 8; col++) {
                const pieza = this.tablero.tablero[fila][col];
                if (!pieza || this.colorPieza(pieza) !== jugador) continue;
                const tipo = this.tipoPieza(pieza);
                for (let df = 0; df < 8; df++) {
                    for (let dc = 0; dc < 8; dc++) {
                        if (df === fila && dc === col) continue;
                        if (!mover_valido(tipo, [fila, col], [df, dc], this.tablero.tablero, jugador)) continue;
                        const nuevoTablero = this.tablero.clone();
                        nuevoTablero.tablero[df][dc] = pieza;
                        nuevoTablero.tablero[fila][col] = null;
                        const nuevoEstado = new Estado(nuevoTablero);
                        nuevoEstado.turnoBlanco = !this.turnoBlanco;
                        nuevoEstado.turnoNegro = !this.turnoNegro;
                        lista.push([nuevoEstado, [fila, col, df, dc]]);
                    }
                }
            }
        }
        return lista;
    }

    terminado() {
        const plano = this.tablero.tablero.flat();
        return !plano.includes('K') || !plano.includes('k');
    }

    ganador(fichaIa) {
        const hayReyBlanco = this.tablero.tablero.some(f => f.includes('K'));
        const hayReyNegro = this.tablero.tablero.some(f => f.includes('k'));
        if (!hayReyBlanco) return fichaIa === 'negro' ? 1 : -1;
        if (!hayReyNegro) return fichaIa === 'blanco' ? 1 : -1;
        return 0;
    }

    jugada(origen, destino) {
        const pieza = this.tablero.tablero[origen[0]][origen[1]];
        this.tablero.tablero[destino[0]][destino[1]] = pieza;
        this.tablero.tablero[origen[0]][origen[1]] = null;
        this.turnoBlanco = !this.turnoBlanco;
    }

    sucesores_para(color) {
        const orig = this.turnoBlanco;
        this.turnoBlanco = color === 'blanco';
        const lst = this.sucesores();
        this.turnoBlanco = orig;
        return lst;
    }

    cambiarturno() {
        this.turnoBlanco = !this.turnoBlanco;
        this.turnoNegro = !this.turnoNegro;
    }
}

export default Estado;
