import { render, screen } from '@testing-library/react';
import ProgressBar from '../../components/ProgressBar';
import { describe, it, expect } from 'vitest';

describe('ProgressBar Component', () => {
    it('deve renderizar com 0% se nenhuma prop for passada', () => {
        render(<ProgressBar />);
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '0');
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('deve renderizar a porcentagem correta', () => {
        render(<ProgressBar progress={50} />);
        const progressBar = screen.getByRole('progressbar');
        const fill = progressBar.querySelector('.progress-fill');
        
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(fill).toHaveStyle({ width: '50%' });
    });

    it('deve limitar valores acima de 100% para 100%', () => {
        render(<ProgressBar progress={150} />);
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('deve limitar valores negativos para 0%', () => {
        render(<ProgressBar progress={-20} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });
});