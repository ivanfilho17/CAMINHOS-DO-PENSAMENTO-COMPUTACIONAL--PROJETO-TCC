import { render, screen, fireEvent } from '@testing-library/react';
import ModulesHomePage from '../../pages/ModulesHomePage';
import { describe, it, expect, vi } from 'vitest';

describe('ModulesHomePage', () => {
    window.scrollTo = vi.fn();

    const modulesMock = [
        { id: 1, title: 'Módulo 1', description: 'Desc 1', icon: 'M1' },
        { id: 2, title: 'Módulo 2', description: 'Desc 2', icon: 'M2' }
    ];

    it('deve bloquear todos os módulos se a introdução não foi feita', () => {
        const progressMock = { intro: { everCompleted: false } };
        const onShowAlert = vi.fn();
        
        render(
            <ModulesHomePage 
                modules={modulesMock} 
                progress={progressMock} 
                onShowAlert={onShowAlert} 
            />
        );

        const locks = screen.getAllByText('🔒');
        expect(locks).toHaveLength(2);

        fireEvent.click(screen.getByText('Módulo 1'));
        
        expect(onShowAlert).toHaveBeenCalledWith(expect.stringContaining("Complete a Introdução primeiro"));
    });

    it('deve desbloquear módulos se a introdução foi feita', () => {
        const progressMock = { intro: { everCompleted: true } };
        const onOpenModule = vi.fn();

        render(
            <ModulesHomePage 
                modules={modulesMock} 
                progress={progressMock} 
                onOpenModule={onOpenModule}
            />
        );

        expect(screen.queryByText('🔒')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Módulo 1'));
        expect(onOpenModule).toHaveBeenCalledWith(1);
    });

    it('deve exibir medalha se o módulo foi completado', () => {
        const progressMock = { 
            intro: { everCompleted: true },
            1: { completed: true, percent: 100 }
        };

        render(<ModulesHomePage modules={modulesMock} progress={progressMock} />);
        
        expect(screen.getByText('🏅')).toBeInTheDocument();
    });
});