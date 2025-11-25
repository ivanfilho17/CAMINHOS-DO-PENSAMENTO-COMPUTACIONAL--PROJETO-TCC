import { cleanup } from '@testing-library/react';
// Importa os matchers para usar expect().toBeInTheDocument() e afins
import '@testing-library/jest-dom/vitest'; 
import { afterEach } from 'vitest';

// Garante que o DOM seja limpo (componentes desmontados) após cada teste, 
// prevenindo efeitos colaterais entre testes.
afterEach(() => {
  cleanup();
});