import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './SequenciaExercicio.css';

// Desafios - AGORA SEM NÚMEROS NO TEXTO
const DESAFIOS = {
    sanduiche: {
        titulo: "Desafio: Ordenar Passos para Fazer um Sanduíche",
        passosCorretos: [
            { id: 'sand-1', content: 'Pegar duas fatias de pão de forma' },
            { id: 'sand-2', content: 'Abrir o pote de requeijão' },
            { id: 'sand-3', content: 'Passar requeijão em uma das fatias' },
            { id: 'sand-4', content: 'Colocar uma fatia de queijo e presunto' },
            { id: 'sand-5', content: 'Fechar o sanduíche com a outra fatia de pão' },
        ]
    },
    cafe: {
        titulo: "Desafio: Monte a Sequência do Café da Manhã",
        passosCorretos: [
            { id: 'cafe-1', content: 'Ferver a água' },
            { id: 'cafe-2', content: 'Coar o café na garrafa térmica' },
            { id: 'cafe-3', content: 'Pegar uma xícara' },
            { id: 'cafe-4', content: 'Adicionar açúcar na xícara (opcional)' },
            { id: 'cafe-5', content: 'Servir o café na xícara' },
        ]
    }
};

// Função para embaralhar os passos
const embaralharPassos = (passos) => [...passos].sort(() => Math.random() - 0.5);

export default function SequenciaExercicio({ desafioId, onConcluido }) {
    const desafio = DESAFIOS[desafioId];
    const [passos, setPassos] = useState(() => embaralharPassos(desafio.passosCorretos));
    const [feedback, setFeedback] = useState('');
    const [concluido, setConcluido] = useState(false);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(passos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPassos(items);
        setFeedback('');
    };

    const verificarResposta = () => {
        const ordemDoUsuario = passos.map(p => p.id);
        const ordemCorreta = desafio.passosCorretos.map(p => p.id);
        if (JSON.stringify(ordemDoUsuario) === JSON.stringify(ordemCorreta)) {
            setFeedback('Parabéns! A sequência está perfeita!');
            setConcluido(true);
            onConcluido();
        } else {
            setFeedback('Ops! A sequência não está correta. Tente novamente.');
        }
    };

    return (
        <div className="exercicio-container">
            <h3>{desafio.titulo}</h3>
            <p>Arraste os blocos para colocá-los na ordem correta.</p>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="passos">
                    {(provided) => (
                        <ul className="lista-passos" {...provided.droppableProps} ref={provided.innerRef}>
                            {passos.map((passo, index) => (
                                <Draggable key={passo.id} draggableId={passo.id} index={index}>
                                    {(provided) => (
                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="passo-item">
                                            {/* NÚMERO DINÂMICO AQUI */}
                                            <span className="passo-numero">{index + 1}</span>
                                            {passo.content}
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <button className="btn" onClick={verificarResposta} disabled={concluido}>
                Verificar
            </button>
            {feedback && <p className={`feedback ${concluido ? 'sucesso' : 'erro'}`}>{feedback}</p>}
        </div>
    );
}