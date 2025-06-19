import Tablero from './Tablero.js';
import Estado from './EstadoAjedrez.js';
import { mover_valido } from './ComprobarMovFichas.js';

/**
 * Clase que expone una interfaz simple para interactuar con el
 * motor de ajedrez sin realizar ninguna operación de entrada/salida.
 */
class AjedrezCore {
    constructor() {
        this.tablero = new Tablero();
        this.estado = new Estado(this.tablero);
    }

    /** Devuelve una copia del tablero actual. */
    getEstado() {
        return this.tablero.getEstado();
    }

    /**
     * Intenta mover una pieza. Devuelve true si el movimiento es válido
     * y se actualizó el estado.
     * @param {number[]} origen [fila, col]
     * @param {number[]} destino [fila, col]
     */
    moverPieza(origen, destino) {
        const pieza = this.tablero.tablero[origen[0]][origen[1]];
        if (!pieza) return false;
        const tipo = this.estado.tipoPieza(pieza);
        const jugador = this.estado.jugadorActual();
        if (
            mover_valido(tipo, origen, destino, this.tablero.tablero, jugador)
        ) {
            this.estado.jugada(origen, destino);
            return true;
        }
        return false;
    }

    /**
     * Devuelve todos los destinos válidos para la pieza en [fila, col].
     * @param {number} fila
     * @param {number} col
     * @returns {Array<[number,number]>}
     */
    getPiezasValidas(fila, col) {
        const pieza = this.tablero.tablero[fila][col];
        if (!pieza) return [];
        const color = this.estado.jugadorActual();
        if (this.estado.colorPieza(pieza) !== color) return [];
        const tipo = this.estado.tipoPieza(pieza);
        const movimientos = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (r === fila && c === col) continue;
                if (mover_valido(tipo, [fila, col], [r, c], this.tablero.tablero, color)) {
                    movimientos.push([r, c]);
                }
            }
        }
        return movimientos;
    }

    /**
     * Devuelve el estado de la partida: 'en curso', 'blanco', 'negro' o 'tablas'.
     */
    estadoPartida() {
        if (!this.estado.terminado()) return 'en curso';
        const g = this.estado.ganador(this.estado.jugadorActual());
        if (g === 1) return 'blanco';
        if (g === -1) return 'negro';
        return 'tablas';
    }
}

export default AjedrezCore;
