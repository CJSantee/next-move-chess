// Assets
import Modal from "react-bootstrap/Modal";

export default function ConfirmModal({
  show,
  onHide,
  title,
  bodyText,
  confirmText,
  onConfirm,
  cancelBtn,
}) {
  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        {cancelBtn && (
          <button className='btn btn-secondary' onClick={onHide}>
            Cancel
          </button>
        )}
        <button className='btn btn-primary' onClick={onConfirm}>
          {confirmText}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
