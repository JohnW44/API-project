// frontend/src/context/Modal.jsx

import { useRef, createContext, useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    const [onModalClose, setOnModalClose] = useState(null);
    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        lat: 0,
        lng: 0,
        name: '',
        description: '',
        price: '',
        previewImage: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const closeModal = () => {
        setModalContent(null);
        if (typeof onModalClose === "function") {
            setOnModalClose(null);
            onModalClose();
        }
    };

    const updateFormField = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const resetForm = (initialData = {}) => {
        setFormData(initialData);
        setFormErrors({});
    };

    const validateSpotForm = () => {
        const errors = {};
        const { country, address, city, state, description, name, price } = formData;

        if (!country) errors.country = "Country is required";
        if (!address) errors.address = "Address is required";
        if (!city) errors.city = "City is required";
        if (!state) errors.state = "State is required";
        if (!description) {
            errors.description = "Description is required";
        } else if (description.length < 30) {
            errors.description = "Description needs 30 or more characters";
        }
        if (!name) errors.name = "Name is required";
        if (!price) errors.price = "Price is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const contextValue = {
        modalRef,
        modalContent,
        setModalContent,
        setOnModalClose,
        closeModal,
        formData,
        formErrors,
        updateFormField,
        resetForm,
        validateSpotForm,
        setFormErrors
    };

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    if (!modalRef || !modalRef.current || !modalContent) return null;
  
    return ReactDOM.createPortal(
      <div id="modal">
        <div id="modal-background" onClick={closeModal} />
        <div id="modal-content">{modalContent}</div>
      </div>,
      modalRef.current
    );
  }
  
  export const useModal = () => useContext(ModalContext);