import { render, screen, fireEvent } from '@testing-library/react';
import IntroPage from '../../pages/IntroPage';
import { describe, it, expect, vi } from 'vitest';

describe('IntroPage', () => {
    window.scrollTo = vi.fn();

    const baseProps = {
        quizData: [],
        onNavigateToSection: vi.fn(),
        onBackHome: vi.fn(),
        onCompleteIntro: vi.fn(),
        onGoToModules: vi.fn(),
        introEverCompleted: false,
        progress: { intro: { everCompleted: false } },
    };

    it('deve permitir avançar para o quiz mesmo sem assistir ao vídeo', () => {
        render(<IntroPage {...baseProps} />);
        // O botão de avançar agora tem aria-label para facilitar a seleção
        // note o texto completo inclui o artigo "o" (Avançar para o Quiz)
        const avancar = screen.getByRole('button', { name: /Avançar para o Quiz/i });
        expect(avancar).toBeInTheDocument();
        expect(avancar).not.toBeDisabled();
    });

    it('todos os botões ícone mostram tooltip via atributo title', () => {
        render(<IntroPage {...baseProps} />);
        const iconButtons = screen.getAllByRole('button').filter(btn => btn.className.includes('btn-icon'));
        expect(iconButtons.length).toBeGreaterThan(0);
        iconButtons.forEach(btn => {
            expect(btn).toHaveAttribute('title');
            expect(btn.getAttribute('title')).toBeTruthy();
        });
    });

    it('chama onNavigateToSection quando avançar é clicado', () => {
        render(<IntroPage {...baseProps} />);
        const avancar = screen.getByRole('button', { name: /Avançar para o Quiz/i });
        fireEvent.click(avancar);
        expect(baseProps.onNavigateToSection).toHaveBeenCalledWith('quiz');
    });
});
