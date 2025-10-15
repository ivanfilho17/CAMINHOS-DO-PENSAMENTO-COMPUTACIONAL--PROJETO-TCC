import React from "react";

export default function BadgeModal({ badge, onClose }) {
    if (!badge) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>🏅 Conquista Desbloqueada!</h2>
                <p>{badge}</p>
                <button className="btn" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}