export function texto_coordenadas(pos) {
    const col = pos.charCodeAt(0) - 'a'.charCodeAt(0);
    const fila = 8 - parseInt(pos[1], 10);
    return [fila, col];
}

export function coordenadas_texto(fila, col) {
    const letra = String.fromCharCode('a'.charCodeAt(0) + col);
    const num = 8 - fila;
    return `${letra}${num}`;
}
