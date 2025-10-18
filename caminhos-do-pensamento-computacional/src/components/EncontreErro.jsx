import React, { useState } from 'react';
import './EncontreErro.css'; // Estilos para a nova atividade

const DESAFIO = {
    titulo: "Desafio: Encontre o Passo Errado!",
    descricao: "O algoritmo para fazer pipoca de micro-ondas tem um passo incorreto. Clique nele!",
    passos: [
        { id: 'p1', content: 'Colocar o pacote de pipoca no micro-ondas.', correto: true },
        { id: 'p2', content: 'Ajustar o tempo para 3 minutos.', correto: true },
        { id: 'p3', content: 'Abrir um livro para ler enquanto espera.', correto: false },
        { id: 'p4', content: 'Esperar o micro-ondas apitar.', correto: true },
        { id: 'p5', content: 'Retirar o pacote com cuidado.', correto: true },
    ],
    feedbackErro: "Quase! Ler um livro é ótimo, mas não faz parte do algoritmo de fazer pipoca. Tente encontrar o passo que está fora de ordem ou não pertence à tarefa.",
    feedbackAcerto: "Exatamente! Este passo não pertence à sequência. Mandou bem!",
};

export default function EncontreErro({ onConcluido }) {
    const [selecionado, setSelecionado] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [concluido, setConcluido] = useState(false);

    const handleSelecionar = (passo) => {
        if (concluido) return;

        setSelecionado(passo.id);
        if (passo.correto) {
            setFeedback(DESAFIO.feedbackErro);
        } else {
            setFeedback(DESAFIO.feedbackAcerto);
            setConcluido(true);
            onConcluido();
        }
    };

    return (
        <div className="encontre-erro-container">
            <h3>{DESAFIO.titulo}</h3>
            <p>{DESAFIO.descricao}</p>
            <ul className="lista-passos-erro">
                {DESAFIO.passos.map((passo, index) => (
                    <li
                        key={passo.id}
                        className={`passo-item-erro ${selecionado === passo.id ? (passo.correto ? 'incorreto' : 'correto') : ''}`}
                        onClick={() => handleSelecionar(passo)}
                        role="button"
                        tabIndex={0}
                    >
                        <span className="passo-numero-erro">{index + 1}</span>
                        {passo.content}
                    </li>
                ))}
            </ul>
            {feedback && (
                <p className={`feedback-encontre-erro ${concluido ? 'sucesso' : 'erro'}`}>
                    {feedback}
                </p>
            )}
        </div>
    );
}