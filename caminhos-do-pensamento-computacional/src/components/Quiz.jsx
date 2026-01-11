import React, { useEffect, useRef } from 'react';
import { useLocalStorage } from "../hooks/useLocalStorage";
import './Quiz.css';

export default function Quiz({ quizData, onQuizComplete, onQuestionAnswered, moduleId = 0 }) {
    
    const keyPrefix = `mod${moduleId}_quiz`;

    // Estados Persistentes
    const [perguntaAtual, setPerguntaAtual] = useLocalStorage(`${keyPrefix}_index`, 0);
    const [pontuacao, setPontuacao] = useLocalStorage(`${keyPrefix}_score`, 0);
    const [respostaSelecionada, setRespostaSelecionada] = useLocalStorage(`${keyPrefix}_selected`, null);
    const [feedback, setFeedback] = useLocalStorage(`${keyPrefix}_feedback`, '');
    const [quizFinalizado, setQuizFinalizado] = useLocalStorage(`${keyPrefix}_finished`, false);

    // Ref para garantir que o callback só seja chamado uma vez (evita loop/travamento)
    const callbackCalledRef = useRef(false);

    // EFEITO DE CONCLUSÃO ROBUSTO
    useEffect(() => {
        // Só executa se estiver finalizado E ainda não tiver chamado o callback
        if (quizFinalizado && !callbackCalledRef.current) {
            callbackCalledRef.current = true; // Marca como chamado imediatamente

            // Timeout para quebrar o ciclo de renderização e evitar travamento visual
            const timer = setTimeout(() => {
                onQuizComplete(pontuacao);
            }, 300); // 300ms de delay para suavidade

            return () => clearTimeout(timer);
        }
    }, [quizFinalizado, pontuacao, onQuizComplete]);

    const handleResponder = (opcaoIndex) => {
        if (respostaSelecionada !== null) return;

        setRespostaSelecionada(opcaoIndex);
        const respostaCorreta = quizData[perguntaAtual].answer;

        if (opcaoIndex === respostaCorreta) {
            setPontuacao(pontuacao + 1);
            setFeedback('Isso mesmo! Resposta correta! 🎉');
        } else {
            setFeedback(`Ops, não foi dessa vez. A resposta correta era a: "${quizData[perguntaAtual].options[respostaCorreta]}"`);
        }

        if (onQuestionAnswered) {
            onQuestionAnswered(perguntaAtual);
        }
    };

    const proximaPergunta = () => {
        if (perguntaAtual < quizData.length - 1) {
            // Se tem mais perguntas, avança
            setRespostaSelecionada(null);
            setFeedback('');
            setPerguntaAtual(perguntaAtual + 1);
        } else {
            // Se é a última, APENAS marca como finalizado.
            // O useEffect lá em cima vai detectar isso e chamar a conclusão.
            setQuizFinalizado(true);
        }
    };

    const pergunta = quizData[perguntaAtual];

    if (!pergunta) return <div>Carregando...</div>;

    return (
        <div className="quiz-container">
            <h3>Quiz de Verificação ({perguntaAtual + 1}/{quizData.length})</h3>
            <div className="pergunta">
                <h4>{pergunta.q}</h4>
            </div>
            <div className="opcoes">
                {pergunta.options.map((opcao, index) => {
                    let className = 'btn-opcao';
                    if (respostaSelecionada !== null) {
                        if (index === pergunta.answer) className += ' correta';
                        else if (index === respostaSelecionada) className += ' incorreta';
                        else className += ' desabilitado';
                    }
                    return (
                        <button key={index} className={className} onClick={() => handleResponder(index)}>
                            {opcao}
                        </button>
                    );
                })}
            </div>

            {feedback && <p className={`feedback-quiz ${respostaSelecionada === pergunta.answer ? 'sucesso' : 'erro'}`}>{feedback}</p>}

            {respostaSelecionada !== null && (
                <button className="btn" onClick={proximaPergunta}>
                    {perguntaAtual < quizData.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
                </button>
            )}
        </div>
    );
}