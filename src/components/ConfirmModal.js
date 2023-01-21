// Assets
import Modal from "react-bootstrap/Modal";

export default function ConfirmModal({
  show,
  onHide,
  title,
  bodyText,
  confirmText,
  onConfirm,
  closeBtn,
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        {closeBtn && (
          <button className='btn btn-secondary' onClick={onHide}>
            Close
          </button>
        )}
        <button className='btn btn-primary' onClick={onConfirm}>
          {confirmText}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
