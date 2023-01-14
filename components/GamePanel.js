import {
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
  faPenToSquare,
  faBookBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { Chess } from "chess.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

function GamePanel({ game, setGame }) {
  const [moves, setMoves] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const parsedHistory = game.history().reduce((acc, move, idx) => {
      if (idx % 2 === 0) {
        acc.push({ white: move });
      } else {
        const lastMove = acc[acc.length - 1];
        acc[acc.length - 1] = { ...lastMove, black: move };
      }
      return acc;
    }, []);
    setMoves(parsedHistory);
  }, [game]);

  /**
   * @description Undo the last half move
   */
  const moveBack = () => {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    const move = gameCopy.undo();
    const historyCopy = [...history];
    historyCopy.push(move);
    setHistory(historyCopy);
    setGame(gameCopy);
  };
  /**
   * @description Undo all previous half moves
   */
  const moveStart = () => {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    const historyCopy = [...history];
    const numHalfMoves = game.history().length;
    console.log("numHalfMoves", numHalfMoves);
    for (let i = 0; i < numHalfMoves; i++) {
      const move = gameCopy.undo();
      historyCopy.push(move);
    }
    setHistory(historyCopy);
    setGame(gameCopy);
  };
  /**
   * @description Redo last half move
   */
  const moveForward = () => {
    const historyCopy = [...history];
    const move = historyCopy.pop();
    setHistory(historyCopy);
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    gameCopy.move(move);
    setGame(gameCopy);
  };
  /**
   * @description Redo all half moves
   */
  const moveEnd = () => {
    const gameCopy = new Chess();
    while (history.length) {
      const move = history.pop();
      gameCopy.move(move);
    }
    setHistory([]);
    setGame(gameCopy);
  };

  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setHistory([]);
  };

  return (
    <>
      <div className='flex-fill mx-3'>
        <div className='card p-2'>
          <p>Moves</p>
          <div className='h-100px overflow-auto hide-scrollbar'>
            <table className='table table-striped'>
              <tbody>
                {moves.map((move, idx) => (
                  <tr key={idx}>
                    <td>{`${idx + 1}.`}</td>
                    <td>{move.white}</td>
                    <td>{move?.black}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='d-flex justify-content-between'>
          <button
            className='btn btn-primary mt-2'
            onClick={moveStart}
            disabled={!moves.length}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button
            className='btn btn-primary mt-2'
            onClick={moveBack}
            disabled={!moves.length}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button
            className='btn btn-primary mt-2'
            onClick={moveForward}
            disabled={!history.length}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button
            className='btn btn-primary mt-2'
            onClick={moveEnd}
            disabled={!history.length}
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </div>
        <div className='d-flex flex-column'>
          <button
            className='btn btn-primary mt-2'
            onClick={resetBoard}
            disabled={
              game.fen() ===
              "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            }
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

export default GamePanel;
