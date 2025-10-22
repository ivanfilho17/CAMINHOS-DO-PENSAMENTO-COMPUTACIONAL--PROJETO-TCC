import React, { useEffect, useMemo, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import "./PlanBackPack.css";

const CATEGORIES = [
    { id: "school", label: "Materiais da Escola" },
    { id: "snack", label: "Lanche" },
    { id: "home", label: "Itens que Ficam em Casa" },
];

const INITIAL_ITEMS = [
    { id: "caderno", label: "Caderno", emoji: "📓", correct: "school" },
    { id: "lapis", label: "Lápis", emoji: "✏️", correct: "school" },
    { id: "livro", label: "Livro", emoji: "📚", correct: "school" },
    { id: "lancheira", label: "Lancheira", emoji: "🍱", correct: "snack" },
    { id: "maca", label: "Maçã", emoji: "🍎", correct: "snack" },
    { id: "bola", label: "Bola", emoji: "⚽", correct: "home" },
    { id: "pijama", label: "Pijama", emoji: "🛌", correct: "home" },
    { id: "brinquedo", label: "Brinquedo", emoji: "🧸", correct: "home" },
];

// === Função utilitária para embaralhar ===
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// === Item arrastável ===
function DraggableItem({ item, draggingDisabled }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDragging ? 9999 : "auto",
    };

    return (
        <div
            ref={setNodeRef}
            className={`pb-item ${isDragging ? "dragging" : ""} ${draggingDisabled ? "disabled" : ""
                }`}
            style={style}
            {...(!draggingDisabled ? listeners : {})}
            {...(!draggingDisabled ? attributes : {})}
            role="button"
            tabIndex={0}
            aria-grabbed={isDragging}
        >
            <div className="pb-item-emoji">{item.emoji}</div>
            <div className="pb-item-label">{item.label}</div>
        </div>
    );
}

// === Box de categoria (droppable) ===
function CategoryBox({ category, children, isOver }) {
    return (
        <div className={`pb-category ${isOver ? "over" : ""}`}>
            <div className="pb-category-title">{category.label}</div>
            <div className="pb-category-content">{children}</div>
        </div>
    );
}

// ✅ COMPONENTE MOVIDO PARA FORA
function DroppableCategory({ category, slots, items, shaking }) {
    const { setNodeRef, isOver } = useDroppable({ id: category.id });
    const itemsInCategory = slots[category.id] || [];

    return (
        <div ref={setNodeRef} className="pb-category-wrapper">
            <CategoryBox category={category} isOver={isOver}>
                {itemsInCategory.length === 0 ? (
                    <div className="pb-placeholder">Arraste os itens aqui</div>
                ) : (
                    itemsInCategory.map((itemId) => {
                        const item = items.find((it) => it.id === itemId);
                        if (!item) return null;
                        return (
                            <div
                                key={item.id}
                                className={`pb-item-placed ${shaking[item.id] ? "shake" : ""}`}
                            >
                                <DraggableItem item={item} draggingDisabled={true} />
                            </div>
                        );
                    })
                )}
            </CategoryBox>
        </div>
    );
}

export default function PlanBackPack({ onConcluido }) {
    const items = useMemo(() => shuffle(INITIAL_ITEMS), []);

    const [slots, setSlots] = useState(() =>
        CATEGORIES.reduce((acc, c) => {
            acc[c.id] = [];
            return acc;
        }, {})
    );

    const [shaking, setShaking] = useState({});
    const [completed, setCompleted] = useState(false);

    const findItemCategory = (itemId) => {
        for (const catId of Object.keys(slots)) {
            if (slots[catId].includes(itemId)) return catId;
        }
        return null;
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const itemId = active?.id;
        if (!itemId || !over) return;

        const targetCategoryId = over.id;
        const itemObj = items.find((it) => it.id === itemId);
        if (!itemObj) return;

        // já colocado corretamente → não permitir mover
        if (findItemCategory(itemId)) return;

        if (itemObj.correct === targetCategoryId) {
            setSlots((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((k) => {
                    updated[k] = updated[k].filter((id) => id !== itemId);
                });
                updated[targetCategoryId].push(itemId);
                return updated;
            });
        } else {
            setShaking((s) => ({ ...s, [itemId]: true }));
            setTimeout(() => setShaking((s) => ({ ...s, [itemId]: false })), 600);
        }
    };

    // ✅ Efeito ajustado e seguro
    useEffect(() => {
        const placedCount = Object.values(slots).reduce((acc, arr) => acc + arr.length, 0);
        const allPlaced = placedCount === items.length;

        if (allPlaced && !completed) {
            setCompleted(true);
            onConcluido?.();
        } else if (!allPlaced && completed) {
            setCompleted(false);
        }
    }, [slots, items.length, completed]);

    const isPlaced = (itemId) => !!findItemCategory(itemId);

    return (
        <div className="plan-backpack-container atividade-container">
            <h3 className="pb-title">Atividade: Planejando a Mochila 🎒</h3>
            <p className="pb-instructions">
                Objetivo: use a <strong>decomposição</strong> para organizar a tarefa:{" "}
                <em>“Vamos arrumar a mochila para a aula de amanhã!”</em>
            </p>

            <DndContext key="plan-backpack" onDragEnd={handleDragEnd}>
                <div className="pb-main">
                    <div className="pb-esteira">
                        <h4>Esteira de Itens</h4>
                        <div className="pb-esteira-content">
                            {items.map((item) => {
                                if (isPlaced(item.id)) return null;
                                return (
                                    <div
                                        key={item.id}
                                        className={`pb-esteira-item ${shaking[item.id] ? "shake" : ""}`}
                                    >
                                        <DraggableItem item={item} />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pb-esteira-note">
                            Arraste cada item para a caixa correta.
                        </div>
                    </div>

                    <div className="pb-categories">
                        <h4>Caixas (subproblemas)</h4>
                        <div className="pb-categories-grid">
                            {CATEGORIES.map((cat) => (
                                <DroppableCategory
                                    key={cat.id}
                                    category={cat}
                                    slots={slots}
                                    items={items}
                                    shaking={shaking}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </DndContext>

            <AnimatePresence>
                {completed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="pb-feedback-success"
                    >
                        ✨ <strong>Parabéns!</strong> Você decompos a tarefa corretamente — todos os
                        itens foram categorizados!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
