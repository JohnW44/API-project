import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css';

function DeleteSpotModal({ onConfirm }) {
  const { closeModal } = useModal();

  const handleDelete = () => {
    onConfirm();
    closeModal();
  };

  return (
    <div className="delete-spot-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <div className="delete-spot-buttons">
        <button 
          onClick={handleDelete}
          className="confirm-delete-button"
        >
          Yes (Delete Spot)
        </button>
        <button 
          onClick={closeModal}
          className="cancel-delete-button"
        >
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;