import Tablero from './Tablero.js';
import Estado from './EstadoAjedrez.js';
import Humano from './Humano.js';
import AlfaBeta from './AlfaBeta.js';

export async function jugarAjedrezHumanoVsHumano() {
    const tablero = new Tablero();
    const estado = new Estado(tablero);
    const j1 = new Humano(estado, 'blanco');
    const j2 = new Humano(estado, 'negro');
    while (!estado.terminado()) {
        tablero.pintar();
        if (estado.jugadorActual() === 'blanco') {
            await j1.hacerJugada();
        } else {
            await j2.hacerJugada();
        }
    }
    tablero.pintar();
    console.log('¡Fin del juego!');
}

export async function jugarAjedrezHumanoVsIA() {
    const tablero = new Tablero();
    const estado = new Estado(tablero);
    const humano = new Humano(estado, 'blanco');
    const ia = new AlfaBeta(estado, 'negro');
    while (!estado.terminado()) {
        tablero.pintar();
        if (estado.jugadorActual() === 'blanco') {
            await humano.hacerJugada();
        } else {
            ia.hacerJugada();
        }
    }
    tablero.pintar();
    const ganador = estado.ganador('blanco');
    if (ganador === 1) console.log('Ganan las blancas');
    else if (ganador === -1) console.log('Ganan las negras');
    else console.log('Tablas');
}