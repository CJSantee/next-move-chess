// Assets
import {
  faArrowsUpDown,
  faCircleChevronUp,
  faCircleChevronDown,
  faCheck,
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
import ConfirmModal from "./ConfirmModal";
import { updatePositionById } from "../lib/positions";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [bookMoves, setBookMoves] = useState(position.book_moves || []);

  useEffect(() => {
    if (position.book_moves) {
      setBookMoves(position.book_moves);
    }
  }, [position]);

  const reorderUp = (index) => {
    if (index === 0) {
      return;
    }
    const bookMovesCopy = [...bookMoves];
    const temp = bookMovesCopy[index - 1];
    bookMovesCopy[index - 1] = bookMovesCopy[index];
    bookMovesCopy[index] = temp;
    setBookMoves(bookMovesCopy);
  };

  const reorderDown = (index) => {
    if (index === bookMoves.length - 1) {
      return;
    }
    const bookMovesCopy = [...bookMoves];
    const temp = bookMovesCopy[index + 1];
    bookMovesCopy[index + 1] = bookMovesCopy[index];
    bookMovesCopy[index] = temp;
    setBookMoves(bookMovesCopy);
  };

  const savePositionChanges = async () => {
    const { success } = await updatePositionById({
      id: position?._id,
      book_moves: bookMoves,
    });
    if (success) {
      setShowConfirmModal(false);
      setReordering(false);
    }
  };

  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
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
            <div className='d-flex'>
              {reordering ? (
                <OverlayTrigger
                  placement='top'
                  overlay={<Tooltip>Save changes</Tooltip>}
                >
                  <button
                    className='btn p-0 me-1 border-0'
                    onClick={() => {
                      setShowConfirmModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement='top'
                  overlay={<Tooltip>Reorder Book Moves</Tooltip>}
                >
                  <button
                    className='btn p-0 me-1 border-0'
                    onClick={() => {
                      setReordering(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowsUpDown} />
                  </button>
                </OverlayTrigger>
              )}
              <OverlayTrigger
                placement='top'
                overlay={<Tooltip>Add Book Move</Tooltip>}
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
          </div>
          <div className='h-200px overflow-auto hide-scrollbar'>
            <table className='table table-striped'>
              <tbody>
                {bookMoves.map((move, idx) => (
                  <tr key={`book_move-${idx}`}>
                    <td className='d-flex justify-content-between align-items-center'>
                      {move}
                      {reordering && (
                        <div className='d-flex'>
                          <button
                            className='btn p-0 me-1 border-0'
                            onClick={() => reorderUp(idx)}
                          >
                            <FontAwesomeIcon icon={faCircleChevronUp} />
                          </button>
                          <button
                            className='btn p-0 ms-1 border-0'
                            onClick={() => reorderDown(idx)}
                          >
                            <FontAwesomeIcon icon={faCircleChevronDown} />
                          </button>
                        </div>
                      )}
                    </td>
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
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => {
          setShowConfirmModal(false);
          setReordering(false);
        }}
        title={"Are you sure?"}
        bodyText={"Click confirm to save updated order of Book Moves."}
        confirmText={"Confirm"}
        onConfirm={savePositionChanges}
        closeBtn
      />
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
