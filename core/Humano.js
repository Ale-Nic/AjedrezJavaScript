import { mover_valido } from './ComprobarMovFichas.js';

class Humano {
    constructor(estado, ficha) {
        this.estado = estado;
        this.ficha = ficha;
    }

    /**
     * Aplica la jugada proporcionada si es válida.
     * @param {number[]} origen [fila, col]
     * @param {number[]} destino [fila, col]
     * @returns {boolean} true si se aplicó la jugada
     */
    hacerJugada(origen, destino) {
        const tablero = this.estado.tablero.tablero;
        const pieza = tablero[origen[0]][origen[1]];
        const tipo = this.estado.tipoPieza(pieza);
        if (!pieza) return false;
        const valido = mover_valido(
            tipo,
            origen,
            destino,
            tablero,
            this.estado.jugadorActual()
        );
        if (valido) {
            this.estado.jugada(origen, destino);
            return true;
        }
        return false;
    }
}

export default Humano;