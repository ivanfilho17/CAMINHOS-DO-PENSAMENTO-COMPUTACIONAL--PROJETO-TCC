import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import "./AssembleCar.css";

// 1. PEÇAS ATUALIZADAS (adicionado 'type' em cada peça)
const PARTS = [
  { id: "carroceria", label: "Carroceria", correct: "slot-carroceria", color: "#ff4d4d", type: "carroceria" },
  { id: "teto", label: "Teto", correct: "slot-teto", color: "#a9a9a9", type: "teto" },
  { id: "roda1", label: "Roda", correct: "slot-roda-e", color: "#333333", type: "roda" },
  { id: "roda2", label: "Roda", correct: "slot-roda-d", color: "#333333", type: "roda" },
  { id: "farol", label: "Farol", correct: "slot-farol", color: "#ffd700", type: "farol" },
  { id: "lanterna", label: "Lanterna", correct: "slot-lanterna", color: "#d63031", type: "lanterna" },
];

function DraggablePart({ part, shaking }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: part.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    backgroundColor: part.color,
    // Remove o estilo inline de borderRadius, será feito por CSS
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      // 2. CLASSE CORRIGIDA: Adiciona part.type (ex: "roda", "teto")
      className={`car-part ${part.type} ${isDragging ? "dragging" : ""} ${shaking ? "shake" : ""}`}
      style={style}
    >
      {part.label}
    </div>
  );
}

function DroppableSlot({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`slot ${isOver ? "over" : ""}`} id={id}>
      {children}
    </div>
  );
}

export default function AssembleCar({ onConcluido }) {
  const [placed, setPlaced] = useState({});
  const [shaking, setShaking] = useState({});
  const [completed, setCompleted] = useState(false);

  const allPlaced = Object.keys(placed).length === PARTS.length;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || completed) return;

    const part = PARTS.find((p) => p.id === active.id);
    if (!part) return;

    if (part.correct === over.id) {
      setPlaced((prev) => ({ ...prev, [part.id]: true }));
    } else {
      setShaking((s) => ({ ...s, [part.id]: true }));
      setTimeout(() => {
        setShaking((s) => ({ ...s, [part.id]: false }));
      }, 600);
    }
  };

  useEffect(() => {
    if (allPlaced && !completed) {
      setCompleted(true);
      onConcluido?.();
    }
  }, [allPlaced, onConcluido, completed]);

  return (
    <div className="assemble-car-container atividade-container">
      <h3 className="ac-title">Atividade: Montando o Carro 🚗</h3>
      <p className="ac-instructions">
        Objetivo: Focar na parte da habilidade de "combinar as soluções".
        Combine as partes corretas para formar o carro, arrastando as peças para o local correto.
      </p>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="ac-main">
          {/* Inventário de Peças */}
          <div className="inventory">
            <h4>Peças</h4>
            <div className="inventory-grid">
              {PARTS.map(
                (part) =>
                  !placed[part.id] && (
                    <DraggablePart key={part.id} part={part} shaking={shaking[part.id]} />
                  )
              )}
            </div>
          </div>

          {/* Área de Montagem com SVG */}
          <div className="assembly-area">
            {/* SVG DA SILHUETA */}
            <svg
              className="car-silhouette"
              viewBox="0 0 400 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Carroceria */}
              <rect x="50" y="100" width="300" height="60" rx="5" className="silhouette" />
              {/* Teto */}
              <path d="M 120 100 L 150 50 H 290 L 320 100" className="silhouette" />
              {/* Rodas */}
              <circle cx="110" cy="160" r="25" className="silhouette" />
              <circle cx="290" cy="160" r="25" className="silhouette" />
              {/* Farol */}
              <rect x="55" y="110" width="20" height="15" className="silhouette" />
              {/* Lanterna */}
              <rect x="325" y="110" width="20" height="15" className="silhouette" />
            </svg>

            {/* SLOTS DE ENCAIXE */}
            <DroppableSlot id="slot-carroceria">
              {placed.carroceria && <div className="placed-part carroceria" />}
            </DroppableSlot>
            <DroppableSlot id="slot-teto">
              {placed.teto && <div className="placed-part teto" />}
            </DroppableSlot>
            <DroppableSlot id="slot-roda-e">
              {placed.roda1 && <div className="placed-part roda" />}
            </DroppableSlot>
            <DroppableSlot id="slot-roda-d">
              {placed.roda2 && <div className="placed-part roda" />}
            </DroppableSlot>
            <DroppableSlot id="slot-farol">
              {placed.farol && <div className="placed-part farol" />}
            </DroppableSlot>
            <DroppableSlot id="slot-lanterna">
              {placed.lanterna && <div className="placed-part lanterna" />}
            </DroppableSlot>

          </div>
        </div>
      </DndContext>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="feedback sucesso"
          >
            ✨ Parabéns! Você montou o carro com sucesso!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}