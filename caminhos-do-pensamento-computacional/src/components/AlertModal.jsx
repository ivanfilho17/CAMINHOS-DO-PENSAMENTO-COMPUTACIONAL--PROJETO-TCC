import React from 'react';
import '../App.css';

// Reutilizaremos os estilos de .modal e .modal-overlay do App.css
export default function AlertModal({ isOpen, onClose, message }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal alert-modal" onClick={(e) => e.stopPropagation()} role="alertdialog">
                <div className="alert-icon">⚠️</div>
                <h2>Atenção!</h2>
                <p>{message}</p>
                <button className="btn" onClick={onClose}>
                    Entendi
                </button>
            </div>
        </div>
    );
}