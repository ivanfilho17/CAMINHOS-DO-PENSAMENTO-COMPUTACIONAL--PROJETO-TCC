import React, { useState } from 'react';
import './Quiz.css';

// 1. Receber a nova prop 'onQuestionAnswered'
export default function Quiz({ quizData, onQuizComplete, onQuestionAnswered }) {
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [pontuacao, setPontuacao] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [quizFinalizado, setQuizFinalizado] = useState(false);

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

        // 2. Chamar a nova função para avisar que uma pergunta foi respondida
        // Passamos o número da pergunta atual (começando em 0)
        if (onQuestionAnswered) {
            onQuestionAnswered(perguntaAtual);
        }
    };

    const proximaPergunta = () => {
        setRespostaSelecionada(null);
        setFeedback('');
        if (perguntaAtual < quizData.length - 1) {
            setPerguntaAtual(perguntaAtual + 1);
        } else {
            setQuizFinalizado(true);
            // A chamada final a onQuizComplete já está a tratar dos 100%
            onQuizComplete(pontuacao + (respostaSelecionada === quizData[perguntaAtual].answer ? 1 : 0));
        }
    };

    const pergunta = quizData[perguntaAtual];

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