// Assets
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
// Components
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Hooks
import { useState, useEffect } from "react";
// Services
import { updatePositionById, postPosition } from "../lib/positions";

export const PositionName = ({ position, addAlert, onUpdate, fen }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(position?.name || "");

  useEffect(() => {
    setName(position?.name);
  }, [position]);

  const onChange = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const submit = async () => {
    const { position: dbPosition, success } = position?._id
      ? await updatePositionById({ id: position._id, name })
      : await postPosition({ ...fenToPosition(fen), name });
    if (success) {
      addAlert({
        type: "success",
        message: position?._id
          ? "Position successfully updated!"
          : "Position added to book!",
        timeout: 1000,
      });
      onUpdate(dbPosition.name);
      setEditing(false);
    }
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
    <div className='d-flex justify-content-between align-items-center mb-2 px-1'>
      <p className='text-md fs-5 fw-light m-0'>{position?.name}</p>
      <div className='d-flex'>
        <OverlayTrigger placement='top' overlay={<Tooltip>Edit Name</Tooltip>}>
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
};
