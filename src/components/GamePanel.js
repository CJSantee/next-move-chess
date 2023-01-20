// Assets
import {
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
  faPenToSquare,
  faBookBookmark,
} from "@fortawesome/free-solid-svg-icons";
// Libraries
import { Chess } from "chess.js";
// Components
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Hooks
import { useState, useEffect } from "react";
import NamePositionModal from "./NamePositionModal";

function GamePanel({
  game,
  setGame,
  position,
  setPosition,
  recording,
  setRecording,
  addOverlay,
  addAlert,
}) {
  const [moves, setMoves] = useState([]);
  const [history, setHistory] = useState([]);

  const [showNameModal, setShowNameModal] = useState(false);

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
   * @description Undo all previous half moves
   */
  const moveStart = () => {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    const historyCopy = [...history];
    const numHalfMoves = game.history().length;
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
      <div className='flex-fill mx-3 my-2'>
        <div className='d-flex justify-content-between align-items-center mb-2 px-1'>
          <p className='text-md fs-5 fw-light m-0'>{position?.name}</p>
          <div className='d-flex'>
            <OverlayTrigger
              placement='top'
              overlay={<Tooltip>Edit Name</Tooltip>}
            >
              <button
                className='btn p-0 me-1 border-0'
                onClick={() => setShowNameModal(true)}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </OverlayTrigger>
          </div>
        </div>
        <div className='card p-2'>
          <div className='d-flex justify-content-between align-items-center pt-1 pb-3'>
            <p className='m-0'>Book Moves</p>
            <OverlayTrigger
              placement='top'
              overlay={<Tooltip>Add book move</Tooltip>}
            >
              <button
                className='btn p-0 ms-1 border-0'
                disabled={recording}
                onClick={() => {
                  setRecording(game.fen());
                  addOverlay({
                    message: "Make a move to add to book.",
                  });
                }}
              >
                <FontAwesomeIcon icon={faBookBookmark} />
              </button>
            </OverlayTrigger>
          </div>
          <div className='h-100px overflow-auto hide-scrollbar'>
            <table className='table table-striped'>
              <tbody>
                {position?.book_moves?.map((move, idx) => (
                  <tr key={idx}>
                    <td>{move}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      <NamePositionModal
        show={showNameModal}
        onHide={() => setShowNameModal(false)}
        onUpdate={(name) => setPosition({ ...position, name })}
        position={position}
        fen={game.fen()}
        addAlert={addAlert}
      />
    </>
  );
}

export default GamePanel;
