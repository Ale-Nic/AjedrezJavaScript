import React, { useState } from 'react';
import AjedrezCore from './core/AjedrezCore';
import AlfaBeta from './core/AlfaBeta';
import './ChessBoard.css';

const PIECES = {
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
  'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
};

function ChessBoard() {
  const [core] = useState(() => new AjedrezCore());
  const [ai] = useState(() => new AlfaBeta(core.estado, 'negro'));
  const [board, setBoard] = useState(core.getEstado());
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [status, setStatus] = useState('en curso');

  const handleCellClick = (r, c) => {
    if (status !== 'en curso') return;
    if (selected) {
      const moved = core.moverPieza(selected, [r, c]);
      if (moved) {
        setBoard(core.getEstado());
        let nextStatus = core.estadoPartida();
        setStatus(nextStatus);
        if (nextStatus === 'en curso') {
          ai.hacerJugada();
          setBoard(core.getEstado());
          nextStatus = core.estadoPartida();
          setStatus(nextStatus);
        }
      }
      setSelected(null);
      setValidMoves([]);
    } else {
      const pieza = board[r][c];
      if (
        pieza &&
        core.estado.colorPieza(pieza) === core.estado.jugadorActual()
      ) {
        setSelected([r, c]);
        setValidMoves(core.getPiezasValidas(r, c));
      }
    }
  };

  return (
    <div>
      <div className="status">Turno: {core.estado.jugadorActual()} - {status}</div>
      <table className="chess-board">
        <tbody>
          {board.map((row, r) => (
            <tr key={r}>
              {row.map((piece, c) => {
                const isDark = (r + c) % 2 === 1;
                const isSel = selected && selected[0] === r && selected[1] === c;
                const isValid = validMoves.some(
                  ([rf, cf]) => rf === r && cf === c
                );
                const classes = [
                  'cell',
                  isDark ? 'dark' : 'light',
                  isSel ? 'selected' : '',
                  isValid ? 'valid' : ''
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <td
                    key={c}
                    className={classes}
                    onClick={() => handleCellClick(r, c)}
                  >
                    {PIECES[piece] || ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChessBoard;
