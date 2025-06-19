const BOARD_SIZE = 8;

class Tablero {
    constructor() {
        this.tablero = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
        this.colocarFichas();
    }

    /**
     * Devuelve una copia del estado actual del tablero.
     */
    getEstado() {
        return this.tablero.map(f => f.slice());
    }

    colocarFichas() {
        this.tablero[0] = ['r','n','b','q','k','b','n','r'];
        this.tablero[1] = Array(8).fill('p');
        this.tablero[6] = Array(8).fill('P');
        this.tablero[7] = ['R','N','B','Q','K','B','N','R'];
    }

    clone() {
        const nuevo = new Tablero();
        nuevo.tablero = this.tablero.map(fila => fila.slice());
        return nuevo;
    }
}

export default Tablero;
