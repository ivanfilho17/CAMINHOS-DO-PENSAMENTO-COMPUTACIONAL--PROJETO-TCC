// Atividade 2 do Módulo 3: Identificar Atributos Essenciais

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { motion, AnimatePresence } from 'framer-motion';
import './AtributosEssenciais.css';

// Desafios com linguagem ajustada
const DESAFIOS = [
    {
        id: 1,
        conceito: 'PÁSSARO',
        emoji: '🐦',
        atributos: [
            { id: 'bico', texto: 'Tem bico', essencial: true },
            { id: 'amarelo', texto: 'É amarelo', essencial: false },
            { id: 'penas', texto: 'Tem penas', essencial: true },
            { id: 'nadar', texto: 'Sabe nadar', essencial: false },
            { id: 'ovos', texto: 'Nasce de ovos', essencial: true },
            { id: 'gaiola', texto: 'Mora em gaiola', essencial: false }
        ],
        explicacao: 'Isso! Todo pássaro tem bico, penas e nasce de ovos. A cor, se ele sabe nadar ou onde mora podem mudar!'
    },
    {
        id: 2,
        conceito: 'CARRO',
        emoji: '🚗',
        atributos: [
            { id: 'rodas', texto: 'Tem rodas', essencial: true },
            { id: 'vermelho', texto: 'É vermelho', essencial: false },
            { id: 'motor', texto: 'Tem motor', essencial: true },
            { id: 'luxo', texto: 'É chique (luxo)', essencial: false },
            { id: 'transporte', texto: 'Serve para transportar', essencial: true },
            { id: '4portas', texto: 'Tem 4 portas', essencial: false }
        ],
        explicacao: 'Muito bem! Um carro precisa de rodas e motor para andar e serve para transportar. A cor, o modelo ou quantas portas tem são apenas detalhes!'
    },
    {
        id: 3,
        conceito: 'LIVRO',
        emoji: '📚',
        atributos: [
            { id: 'paginas', texto: 'Tem páginas', essencial: true },
            { id: 'capa-dura', texto: 'Tem capa dura', essencial: false },
            { id: 'texto', texto: 'Tem texto ou imagens', essencial: true },
            { id: 'romance', texto: 'É uma história de amor', essencial: false },
            { id: 'ler', texto: 'Serve para ler', essencial: true },
            { id: 'cheiro', texto: 'Tem cheiro de novo', essencial: false }
        ],
        explicacao: 'Exato! Um livro precisa ter páginas, ter conteúdo (texto/imagens) e servir para ler. Se a capa é dura ou mole, ou o tipo de história, são coisas que variam.'
    }
];

// Função para embaralhar array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function AtributosEssenciais({ onConcluido }) {
    // ESTADOS PERSISTENTES
    const [desafioAtual, setDesafioAtual] = useLocalStorage("mod3_atributos_desafio", 0);
    const [acertos, setAcertos] = useLocalStorage("mod3_atributos_acertos", 0);
    const [concluido, setConcluido] = useLocalStorage("mod3_atributos_concluido", false);

    const [selecionados, setSelecionados] = useLocalStorage("mod3_atributos_selecionados", []);
    const [verificado, setVerificado] = useLocalStorage("mod3_atributos_verificado", false);
    const [feedback, setFeedback] = useLocalStorage("mod3_atributos_feedback", null);
    
    const [atributosEmbaralhados, setAtributosEmbaralhados] = useLocalStorage("mod3_atributos_opcoes", []);

    const desafio = DESAFIOS[desafioAtual] || DESAFIOS[0];
    const ultimoDesafio = desafioAtual === DESAFIOS.length - 1;

    useEffect(() => {
        if (concluido) {
            onConcluido?.();
        }
    }, [concluido, onConcluido]);

    // Embaralha sempre que mudar o desafio (SE ainda não tiver embaralhado salvo)
    useEffect(() => {
        if (desafio) {
            if (atributosEmbaralhados.length === 0) {
                setAtributosEmbaralhados(shuffle(desafio.atributos));
            }
        }
    }, [desafioAtual, atributosEmbaralhados.length]);

    const handleToggleAtributo = (atributoId) => {
        if (verificado) return;

        setSelecionados(prev =>
            prev.includes(atributoId)
                ? prev.filter(id => id !== atributoId)
                : [...prev, atributoId]
        );
    };

    const handleVerificar = () => {
        const atributosEssenciais = desafio.atributos
            .filter(a => a.essencial)
            .map(a => a.id);

        const todosEssenciaisSelecionados = atributosEssenciais.every(id =>
            selecionados.includes(id)
        );

        const nenhumDesnecessarioSelecionado = selecionados.every(id =>
            atributosEssenciais.includes(id)
        );

        const correto = todosEssenciaisSelecionados && nenhumDesnecessarioSelecionado;

        setVerificado(true);

        if (correto) {
            setFeedback({ tipo: 'sucesso', mensagem: desafio.explicacao });
            setAcertos(prev => prev + 1);
        } else {
            const faltou = atributosEssenciais.filter(id => !selecionados.includes(id));
            const sobrou = selecionados.filter(id => !atributosEssenciais.includes(id));

            let mensagem = '';
            if (sobrou.length > 0) {
                mensagem = 'Ops! Você marcou coisas que podem mudar (detalhes). Tente focar no que é obrigatório!';
            } else if (faltou.length > 0) {
                mensagem = `Faltou coisa! Para ser um(a) ${desafio.conceito}, ele(a) precisa de mais características importantes.`;
            }

            setFeedback({ tipo: 'erro', mensagem });
        }
    };

    const proximoDesafio = () => {
        if (ultimoDesafio) {
            setConcluido(true);
            onConcluido && onConcluido();
        } else {
            setDesafioAtual(prev => prev + 1);
            
            // RESETAR ESTADOS PARA O PRÓXIMO NÍVEL
            setSelecionados([]);
            setVerificado(false);
            setFeedback(null);
            setAtributosEmbaralhados([]); // Limpa para gerar novo embaralhamento
        }
    };

    const tentarNovamente = () => {
        setSelecionados([]);
        setVerificado(false);
        setFeedback(null);
        
        // AJUSTE: Re-embaralha as opções ao tentar novamente
        if (desafio) {
            setAtributosEmbaralhados(shuffle(desafio.atributos));
        }
    };

    return (
        <div className="atividade-container atributos-essenciais-container">
            <h2>🎯 O que define um...?</h2>
            <p className="instrucoes">
                Pense bem: Para ser esse objeto, o que ele <strong>TEM que ter</strong>?
                <br />Marque só o que é obrigatório. Detalhes que podem mudar (como a cor) não valem!
            </p>

            {!concluido ? (
                <>
                    <div className="desafio-header">
                        <div className="conceito-box1">
                            <div className="conceito-emoji">{desafio.emoji}</div>
                            <h4>O que é essencial para um...<br /><strong>{desafio.conceito}</strong>?</h4>
                        </div>
                        <div className="contador-desafios">
                            Desafio {desafioAtual + 1} de {DESAFIOS.length}
                        </div>
                    </div>

                    {/* Lista de Atributos */}
                    <div className="atributos-lista">
                        {atributosEmbaralhados.map((atributo) => {
                            const selecionado = selecionados.includes(atributo.id);
                            let className = 'atributo-item';

                            if (selecionado) className += ' selecionado';
                            if (verificado) {
                                if (atributo.essencial && selecionado) {
                                    className += ' correto';
                                } else if (!atributo.essencial && selecionado) {
                                    className += ' incorreto';
                                } else if (atributo.essencial && !selecionado) {
                                    className += ' faltou';
                                }
                            }

                            return (
                                <motion.div
                                    key={atributo.id}
                                    className={className}
                                    onClick={() => handleToggleAtributo(atributo.id)}
                                    whileHover={!verificado ? { scale: 1.02 } : {}}
                                    whileTap={!verificado ? { scale: 0.98 } : {}}
                                >
                                    <div className="checkbox">
                                        {selecionado && <span className="checkmark">✓</span>}
                                    </div>
                                    <span className="atributo-texto">{atributo.texto}</span>
                                    {verificado && atributo.essencial && (
                                        <span className="badge-essencial">Essencial!</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Feedback */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`feedback-box ${feedback.tipo}`}
                            >
                                {feedback.tipo === 'sucesso' ? '🎉' : '🤔'} {feedback.mensagem}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Botões */}
                    <div className="botoes-acao">
                        {!verificado ? (
                            <button
                                className="btn-verificar"
                                onClick={handleVerificar}
                                disabled={selecionados.length === 0}
                            >
                                Conferir
                            </button>
                        ) : (
                            <>
                                {feedback.tipo === 'erro' && (
                                    <button className="btn-tentar" onClick={tentarNovamente}>
                                        Tentar Novamente
                                    </button>
                                )}
                                <button className="btn-proximo" onClick={proximoDesafio}>
                                    {ultimoDesafio ? 'Finalizar Atividade' : 'Próximo →'}
                                </button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div className="resultado-final">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="resultado-conteudo"
                    >
                        <div className="resultado-emoji">🏆</div>
                        <h3>Parabéns! 👏🏽</h3>
                        <h3>Atividade Concluída! ✅</h3>
                        <p className="resultado-texto">
                            Você acertou {acertos} de {DESAFIOS.length} desafios!
                        </p>
                        <p className="resultado-mensagem">
                            {acertos === DESAFIOS.length
                                ? 'Perfeito! Você entendeu muito bem o que é essencial!'
                                : 'Bom trabalho! Você está aprendendo a identificar o que é importante.'}
                        </p>
                        <div className="conceito-aprendido">
                            <strong>💡 O que aprendemos:</strong>
                            <p>
                                <strong>Abstração</strong> é focar apenas no que é principal e ignorar os detalhes que mudam.
                                Assim a gente entende o que as coisas realmente são!
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}