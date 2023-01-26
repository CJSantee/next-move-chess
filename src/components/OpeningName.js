// Assets
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
// Components
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Hooks
import { useState, useEffect } from "react";
// Services
import { getOpening, postOpening, updateOpeningById } from "../lib/openings";
import { getMovesFromGame } from "../lib/utils/moves";
import { shortenFen } from "../lib/utils/positions";

export default function OpeningName({ game, addAlert }) {
  const [editing, setEditing] = useState(false);
  const [opening, setOpening] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const getOpeningFromDB = async () => {
      const dbOpening = await getOpening({ fen: game.fen() });
      setName(dbOpening?.name);
      setOpening(dbOpening);
      console.log(dbOpening);
    };
    getOpeningFromDB();
  }, [game]);

  /**
   * @description Change handler for input
   * @param {event} e
   */
  const onChange = (e) => {
    const { value } = e.target;
    setName(value);
  };

  /**
   * @description If opening already exists, update the name, otherwise create a new opening.
   */
  const submit = async () => {
    if (opening?._id) {
      const { success, opening: dbOpening } = await updateOpeningById({
        id: opening._id,
        name,
      });
      setName(dbOpening.name);
    } else {
      const newOpening = {
        name,
        moves: getMovesFromGame(game),
        fen: shortenFen(game.fen()),
      };
      const { success, opening: dbOpening } = await postOpening(newOpening);
      setOpening(dbOpening);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <div className='input-group mb-2'>
        <input
          type='text'
          className='form-control'
          value={name}
          onChange={onChange}
        />
        <button
          className='btn btn-outline-secondary'
          onClick={() => setEditing(false)}
        >
          Cancel
        </button>
        <button
          className='btn btn-outline-primary'
          type='button'
          onClick={submit}
        >
          Update
        </button>
      </div>
    );
  }
  return (
    <div className='d-flex w-100 justify-content-between align-items-center mb-2 px-1'>
      <p className='text-md fs-5 fw-light m-0'>{name}</p>
      <div className='d-flex'>
        <OverlayTrigger
          placement='top'
          overlay={<Tooltip>Edit Opening Name</Tooltip>}
        >
          <button
            className='btn p-0 me-1 border-0'
            onClick={() => setEditing(true)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </OverlayTrigger>
      </div>
    </div>
  );
}
