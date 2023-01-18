// Assets
import {
  faAngleLeft,
  faAngleRight,
  faChessBoard,
} from "@fortawesome/free-solid-svg-icons";
// Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
// Hooks
import { useEffect, useState } from "react";
// Libraries
import { Chess } from "chess.js";

export default function History({ game, setGame }) {
  const [moves, setMoves] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Split history into moves for white and black
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

  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setHistory([]);
  };

  return (
    <div className='d-flex justify-content-evenly w-100 my-3'>
      <OverlayTrigger
        placement='top'
        overlay={<Tooltip>Reset Position</Tooltip>}
      >
        <button
          className='btn btn-primary ms-2 ms-md-0 me-1'
          onClick={resetBoard}
          disabled={
            game.fen() ===
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          }
        >
          <FontAwesomeIcon icon={faChessBoard} />
        </button>
      </OverlayTrigger>
      <div className='d-flex align-items-center flex-fill bg-secondary bg-gradient bg-opacity-25 rounded p-2 mx-1 overflow-auto hide-scrollbar'>
        <div className='d-flex min-w-max-content'>
          {moves.length ? (
            moves.map((move, idx) => (
              <p key={`move-${idx}`} className='my-0 me-3'>
                {idx + 1}. {move?.white} {move?.black}
              </p>
            ))
          ) : (
            <p className='my-0'>1.</p>
          )}
        </div>
      </div>
      <div className='d-flex ms-1 me-2 me-md-0'>
        <button
          className='btn btn-primary me-1'
          onClick={moveBack}
          disabled={!moves.length}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button
          className='btn btn-primary ms-1'
          onClick={moveForward}
          disabled={!history.length}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
}
