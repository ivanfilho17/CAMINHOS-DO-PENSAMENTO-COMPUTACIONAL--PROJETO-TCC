import { render, screen } from '@testing-library/react';
import Module from '../../pages/Module';
import { describe, it, expect, vi } from 'vitest';

// mock useNavigate from react-router-dom to prevent errors during render
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

describe('Module Page', () => {
    window.scrollTo = vi.fn();

    const minimalModuleData = {
        id: 1,
        nameModule: 'Módulo de Teste',
        teoria: { exemplosReais: null },
        atividades: [],
        quiz: []
    };

    const baseProps = {
        moduleData: minimalModuleData,
        onNavigateToSection: vi.fn(),
        onComplete: vi.fn(),
        onAdvance: vi.fn(),
        onBackHome: vi.fn(),
        onReset: vi.fn(),
        progress: { percent: 0 },
        onProgressUpdate: vi.fn()
    };

    it('should render without crashing and display icon buttons with titles', () => {
        render(<Module {...baseProps} />);
        const iconButtons = screen.getAllByRole('button').filter(btn => btn.className.includes('btn-icon'));
        expect(iconButtons.length).toBeGreaterThan(0);
        iconButtons.forEach(btn => {
            expect(btn).toHaveAttribute('title');
            expect(btn.getAttribute('title')).toBeTruthy();
        });
    });
});
