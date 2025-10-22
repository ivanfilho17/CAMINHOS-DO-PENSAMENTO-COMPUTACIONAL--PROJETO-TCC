import React, { useState, useEffect, useMemo } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import leaoImg from "../assets/leao.png";
import "./DigitalPuzzle.css";

const IMAGE = leaoImg;
const GRID_COLS = 3;
const GRID_ROWS = 3;
const PIECE_SIZE = 100;

function DraggablePiece({ id, piece }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id });

    const style = {
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        backgroundImage: `url(${IMAGE})`,
        backgroundPosition: `${piece.x * -PIECE_SIZE}px ${piece.y * -PIECE_SIZE}px`,
        backgroundSize: `${PIECE_SIZE * GRID_COLS}px ${PIECE_SIZE * GRID_ROWS}px`,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        zIndex: isDragging ? 100 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            className={`puzzle-piece ${isDragging ? "dragging" : ""}`}
            style={style}
            {...listeners}
            {...attributes}
        />
    );
}

function DroppableSlot({ id, children }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className={`puzzle-slot ${isOver ? "over" : ""}`}>
            {children}
        </div>
    );
}

export default function DigitalPuzzle({ onConcluido }) {
    const [slots, setSlots] = useState({});
    const [completed, setCompleted] = useState(false);

    const pieces = useMemo(() => {
        const result = [];
        for (let y = 0; y < GRID_ROWS; y++) {
            for (let x = 0; x < GRID_COLS; x++) {
                result.push({ id: `${x}-${y}`, x, y });
            }
        }
        return result;
    }, []);

    const shuffledPieces = useMemo(
        () => [...pieces].sort(() => Math.random() - 0.5),
        [pieces]
    );

    const handleDragEnd = (event) => {
        const { over, active } = event;
        if (over && over.id && slots[over.id] !== active.id) {
            setSlots((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((key) => {
                    if (updated[key] === active.id) delete updated[key];
                });
                updated[over.id] = active.id;
                return updated;
            });
        }
    };

    useEffect(() => {
        const allPlaced = Object.keys(slots).length === pieces.length;
        if (allPlaced && !completed) {
            const isCorrect = pieces.every((p) => slots[p.id] === p.id);
            if (isCorrect) {
                setCompleted(true);
                onConcluido?.();
            }
        }
    }, [slots, pieces, completed, onConcluido]);

    return (
        <div className="atividade-container puzzle-container">
            <h3 className="puzzle-title">Atividade: Montando a imagem 🧩</h3>
            <p className="puzzle-instructions">
                Arraste as peças para formar a figura completa do leão.
            </p>

            <DndContext key="digital-puzzle" onDragEnd={handleDragEnd}>
                <div className="puzzle-content">
                    <div
                        className="puzzle-grid"
                        style={{
                            gridTemplateColumns: `repeat(${GRID_COLS}, ${PIECE_SIZE}px)`,
                            gridTemplateRows: `repeat(${GRID_ROWS}, ${PIECE_SIZE}px)`,
                        }}
                    >
                        {pieces.map((piece) => (
                            <DroppableSlot key={piece.id} id={piece.id}>
                                {slots[piece.id] && (
                                    <DraggablePiece
                                        id={slots[piece.id]}
                                        piece={pieces.find((p) => p.id === slots[piece.id])}
                                    />
                                )}
                            </DroppableSlot>
                        ))}
                    </div>

                    <div className="puzzle-shuffled">
                        {shuffledPieces.map((piece) => {
                            const isUsed = Object.values(slots).includes(piece.id);
                            return (
                                <div key={piece.id} className="shuffled-piece-wrapper">
                                    {!isUsed && <DraggablePiece id={piece.id} piece={piece} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DndContext>

            <AnimatePresence>
                {completed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="feedback sucesso"
                    >
                        ✨ <strong>Parabéns!</strong> Você montou o quebra-cabeça com
                        sucesso!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
