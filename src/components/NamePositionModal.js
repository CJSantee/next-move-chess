// CURRENTLY NOT USED

// Hooks
import { useEffect, useState } from "react";
// Components
import Modal from "react-bootstrap/Modal";
// Services
import { updatePositionById, postPosition } from "../lib/positions";
// Utils
import { fenToPosition } from "../lib/utils/positions";

function NamePositionModal({
  show,
  onHide,
  onUpdate,
  addAlert,
  position,
  fen,
}) {
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
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <div className='rounded d-flex flex-column justify-content-center p-3'>
        <label className='form-label'>Name Position</label>
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            value={name}
            onChange={onChange}
          />
          <button
            className='btn btn-outline-primary'
            type='button'
            onClick={submit}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default NamePositionModal;
