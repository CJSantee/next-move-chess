// Assets
import {
  faArrowsUpDown,
  faCircleChevronUp,
  faCircleChevronDown,
  faCheck,
  faTrash,
  faBookBookmark,
} from "@fortawesome/free-solid-svg-icons";
// Components
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmModal from "./ConfirmModal";
// Hooks
import { useState, useEffect } from "react";
// Services
import { updatePositionById, getRandomAfterBookMove } from "../lib/positions";
import { PositionName } from "./PositionName";

function GamePanel({
  game,
  setGame,
  position,
  setPosition,
  recording,
  setRecording,
  setStudying,
  addOverlay,
  addAlert,
}) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [bookMoves, setBookMoves] = useState(position.book_moves || []);

  useEffect(() => {
    if (position.book_moves) {
      setBookMoves(position.book_moves);
    } else {
      setBookMoves([]);
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

  const removeBookMove = async () => {
    const bookMovesCopy = [...bookMoves];
    bookMovesCopy.splice(confirmDelete, 1);
    await updatePositionById({ id: position?._id, book_moves: bookMovesCopy });
    setBookMoves(bookMovesCopy);
    setConfirmDelete(null);
  };

  const savePositionChanges = async () => {
    const { success } = await updatePositionById({
      id: position?._id,
      book_moves: bookMoves,
    });
    setReordering(false);
    return success;
  };

  const study = async () => {
    try {
      const { position: nextPosition, move } = await getRandomAfterBookMove(
        game.fen(),
        bookMoves
      );
      setStudying(move);
      addOverlay({ message: nextPosition.name });
    } catch (error) {
      addAlert({ type: "danger", message: error, timeout: 3000 });
    }
  };

  return (
    <>
      <div className='flex-fill mx-3 my-2'>
        <PositionName
          position={position}
          onUpdate={(name) => setPosition({ ...position, name })}
          addAlert={addAlert}
          fen={game.fen()}
        />
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
                    onClick={savePositionChanges}
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
                      {reordering ? (
                        <div className='d-flex'>
                          <button
                            className='btn px-1 py-0 border-0'
                            onClick={() => reorderUp(idx)}
                          >
                            <FontAwesomeIcon icon={faCircleChevronUp} />
                          </button>
                          <button
                            className='btn px-1 py-0 border-0'
                            onClick={() => reorderDown(idx)}
                          >
                            <FontAwesomeIcon icon={faCircleChevronDown} />
                          </button>
                        </div>
                      ) : (
                        <div className='d-flex'>
                          <button
                            className='btn p-0 border-0'
                            onClick={() => setConfirmDelete(idx)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
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
        <div className='d-flex flex-column mt-2'>
          <button className='btn btn-primary' onClick={study}>
            Study
          </button>
        </div>
      </div>
      <ConfirmModal
        show={confirmDelete}
        onHide={() => {
          setConfirmDelete(null);
        }}
        title={"Are you sure?"}
        bodyText={`Click confirm to remove ${
          position?.book_moves?.[confirmDelete] || "move"
        } from Book Moves.`}
        confirmText={"Confirm"}
        onConfirm={removeBookMove}
        cancelBtn
      />
    </>
  );
}

export default GamePanel;
