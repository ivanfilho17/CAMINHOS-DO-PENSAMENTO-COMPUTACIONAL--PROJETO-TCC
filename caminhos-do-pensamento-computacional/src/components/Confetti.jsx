import React from 'react';
import './Confetti.css'; // Estilos da animação

// Gera um número aleatório dentro de um intervalo
const randomInRange = (min, max) => Math.random() * (max - min) + min;

// Cria um array de confetes com propriedades aleatórias
const confetti = Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    style: {
        left: `${randomInRange(0, 100)}%`,
        backgroundColor: `hsl(${randomInRange(0, 360)}, 70%, 60%)`,
        transform: `rotate(${randomInRange(-90, 90)}deg)`,
        animationDelay: `${randomInRange(0, 5)}s`,
        animationDuration: `${randomInRange(3, 6)}s`,
    },
}));

export default function Confetti() {
    return (
        <div className="confetti-container" aria-hidden="true">
            {confetti.map(c => <div key={c.id} className="confetti" style={c.style} />)}
        </div>
    );
}