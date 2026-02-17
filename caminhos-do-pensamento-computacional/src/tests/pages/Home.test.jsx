import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../../pages/Home';
import { describe, it, expect, vi } from 'vitest';

describe('Home Page', () => {
    window.scrollTo = vi.fn();

    it('deve renderizar o título corretamente', () => {
        render(<Home />);
        expect(screen.getByText('Caminhos do Pensamento Computacional')).toBeInTheDocument();
    });

    it('deve mostrar apenas o botão "Iniciar" quando a introdução NÃO foi completada', () => {
        const progressMock = { intro: { everCompleted: false } };
        render(<Home progress={progressMock} />);
        
        const startBtn = screen.getByRole('button', { name: /Iniciar - Começar pela Introdução/i });
        expect(startBtn).toBeInTheDocument();
        expect(screen.queryByText('Acessar Módulos')).not.toBeInTheDocument();
    });

    it('deve mostrar "Introdução" e "Acessar Módulos" quando a introdução FOI completada', () => {
        const progressMock = { intro: { everCompleted: true } };
        render(<Home progress={progressMock} />);
        
        expect(screen.getByText('Introdução')).toBeInTheDocument();
        expect(screen.getByText('Acessar Módulos')).toBeInTheDocument();
    });

    it('deve chamar a função onStart ao clicar no botão de início', () => {
        const onStartMock = vi.fn();
        render(<Home onStart={onStartMock} />);
        
        fireEvent.click(screen.getByText('Iniciar'));
        expect(onStartMock).toHaveBeenCalledTimes(1);
    });

    it('deve chamar a função onNavigateToModules ao clicar em acessar módulos', () => {
        const onNavigateMock = vi.fn();
        const progressMock = { intro: { everCompleted: true } };
        
        render(<Home progress={progressMock} onNavigateToModules={onNavigateMock} />);
        
        fireEvent.click(screen.getByText('Acessar Módulos'));
        expect(onNavigateMock).toHaveBeenCalledTimes(1);
    });
});