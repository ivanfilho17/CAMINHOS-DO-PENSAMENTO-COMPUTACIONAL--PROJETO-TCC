import { render, screen, fireEvent, act } from '@testing-library/react';
import Quiz from '../../components/Quiz';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Quiz Component', () => {
    const mockQuizData = [
        { q: 'Pergunta 1?', options: ['Errada', 'Certa'], answer: 1 },
        { q: 'Pergunta 2?', options: ['Certa', 'Errada'], answer: 0 }
    ];

    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('deve renderizar a primeira pergunta corretamente', () => {
        render(<Quiz quizData={mockQuizData} />);
        
        expect(screen.getByText('Quiz de Verificação (1/2)')).toBeInTheDocument();
        expect(screen.getByText('Pergunta 1?')).toBeInTheDocument();
        expect(screen.getByText('Errada')).toBeInTheDocument();
        expect(screen.getByText('Certa')).toBeInTheDocument();
    });

    it('deve fornecer feedback de sucesso ao acertar', () => {
        render(<Quiz quizData={mockQuizData} />);
        
        fireEvent.click(screen.getByText('Certa'));

        expect(screen.getByText(/Isso mesmo! Resposta correta!/i)).toBeInTheDocument();
        expect(screen.getByText('Próxima Pergunta')).toBeInTheDocument();
    });

    it('deve fornecer feedback de erro ao errar', () => {
        render(<Quiz quizData={mockQuizData} />);
        
        fireEvent.click(screen.getByText('Errada'));

        expect(screen.getByText(/Ops, não foi dessa vez/i)).toBeInTheDocument();
    });

    it('deve chamar onQuizComplete com a pontuação ao finalizar', () => {
        vi.useFakeTimers();
        const onQuizCompleteMock = vi.fn();
        
        render(<Quiz quizData={mockQuizData} onQuizComplete={onQuizCompleteMock} />);
        
        // Pergunta 1: Acerta
        fireEvent.click(screen.getByText('Certa'));
        fireEvent.click(screen.getByText('Próxima Pergunta'));

        // Pergunta 2: Erra
        fireEvent.click(screen.getByText('Errada'));
        
        fireEvent.click(screen.getByText('Finalizar Quiz'));

        act(() => {
            vi.runAllTimers();
        });

        expect(onQuizCompleteMock).toHaveBeenCalledWith(1);
        
        vi.useRealTimers();
    });
});