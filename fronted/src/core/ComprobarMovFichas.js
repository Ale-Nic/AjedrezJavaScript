function torre(origen, destino) {
    const [filaA, colA] = origen;
    const [filaD, colD] = destino;
    return filaA === filaD || colA === colD;
}

function alfil(origen, destino) {
    const [filaA, colA] = origen;
    const [filaD, colD] = destino;
    return Math.abs(filaA - filaD) === Math.abs(colA - colD);
}

function caballo(origen, destino) {
    const [filaA, colA] = origen;
    const [filaD, colD] = destino;
    const x = Math.abs(filaA - filaD);
    const y = Math.abs(colA - colD);
    return (x === 2 && y === 1) || (x === 1 && y === 2);
}

function reina(origen, destino) {
    return torre(origen, destino) || alfil(origen, destino);
}

function rey(origen, destino) {
    const [filaA, colA] = origen;
    const [filaD, colD] = destino;
    const x = Math.abs(filaA - filaD);
    const y = Math.abs(colA - colD);
    return x <= 1 && y <= 1 && (x + y !== 0);
}

function peon(origen, destino, color) {
    const [filaA, colA] = origen;
    const [filaD, colD] = destino;
    const direccion = color === 'blanco' ? -1 : 1;
    const filaInicio = color === 'blanco' ? 6 : 1;
    if (filaD - filaA === direccion && colA === colD) return true;
    if (filaA === filaInicio && filaD - filaA === 2 * direccion && colA === colD)
        return true;
    return false;
}

function caminoLibre(origen, destino, tablero) {
    let [filaA, colA] = origen;
    const [filaD, colD] = destino;
    const pasoFila = filaA !== filaD ? (filaD - filaA) / Math.abs(filaD - filaA) : 0;
    const pasoCol = colA !== colD ? (colD - colA) / Math.abs(colD - colA) : 0;
    filaA += pasoFila;
    colA += pasoCol;
    while (filaA !== filaD || colA !== colD) {
        if (tablero[filaA][colA] !== null) return false;
        filaA += pasoFila;
        colA += pasoCol;
    }
    return true;
}

export function mover_valido(pieza, origen, destino, tablero, color) {
    const [filaD, colD] = destino;
    const destino_pieza = tablero[filaD][colD];
    let color_destino = null;
    if (destino_pieza && typeof destino_pieza === 'string' && destino_pieza.trim() !== '') {
        color_destino = destino_pieza === destino_pieza.toUpperCase() ? 'blanco' : 'negro';
    }
    if (color_destino === color) return false;
    const mapping = { p: 'peon', n: 'caballo', r: 'torre', b: 'alfil', q: 'reina', k: 'rey' };
    const pieza_tipo = mapping[pieza] || pieza;
    if (pieza_tipo === 'torre') {
        return torre(origen, destino) && caminoLibre(origen, destino, tablero);
    } else if (pieza_tipo === 'alfil') {
        return alfil(origen, destino) && caminoLibre(origen, destino, tablero);
    } else if (pieza_tipo === 'reina') {
        return reina(origen, destino) && caminoLibre(origen, destino, tablero);
    } else if (pieza_tipo === 'caballo') {
        return caballo(origen, destino);
    } else if (pieza_tipo === 'rey') {
        return rey(origen, destino);
    } else if (pieza_tipo === 'peon') {
        const [filaA, colA] = origen;
        const direccion = color === 'blanco' ? -1 : 1;
        const filaInicio = color === 'blanco' ? 6 : 1;
        if (colA === colD) {
            if (filaD - filaA === direccion && tablero[filaD][colD] === null) return true;
            if (filaA === filaInicio && filaD - filaA === 2 * direccion) {
                const intermedia = filaA + direccion;
                if (tablero[intermedia][colD] === null && tablero[filaD][colD] === null) return true;
            }
        } else if (Math.abs(colD - colA) === 1 && filaD - filaA === direccion) {
            if (color_destino !== null && color_destino !== color) return true;
            return false;
        }
        return false;
    } else {
        throw new Error(`Pieza desconocida: ${pieza}`);
    }
}

export { torre, alfil, caballo, reina, rey, peon, caminoLibre };
