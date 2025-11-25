import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';
import { beforeEach, expect, vi } from 'vitest';

// Mock do localStorage para rodar no JSDOM
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: vi.fn(key => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useLocalStorage Hook', () => {
    beforeEach(() => {
        localStorage.clear(); // Limpa o mock antes de cada teste
    });

    test('deve retornar o valor inicial se não houver nada no localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('testeKey', 'valorInicial'));

        // O valor no estado deve ser o valor inicial
        expect(result.current[0]).toBe('valorInicial');

        // O localStorage.getItem deve ter sido chamado com a chave
        expect(localStorage.getItem).toHaveBeenCalledWith('testeKey');
    });

    test('deve carregar o valor existente do localStorage', () => {
        localStorage.setItem('testeKey', JSON.stringify('valorPersistido'));

        const { result } = renderHook(() => useLocalStorage('testeKey', 'valorInicial'));

        // O valor no estado deve ser o valor do localStorage
        expect(result.current[0]).toBe('valorPersistido');
    });

    test('deve atualizar o estado e o localStorage ao chamar setValue', () => {
        const { result } = renderHook(() => useLocalStorage('testeKey', 'valorInicial'));
        const [, setValue] = result.current;

        const novoValor = 'novoValor';

        // Simula a atualização do estado
        act(() => {
            setValue(novoValor);
        });

        // 1. Verifica se o estado foi atualizado
        expect(result.current[0]).toBe(novoValor);

        // 2. Verifica se o localStorage foi atualizado corretamente
        expect(localStorage.setItem).toHaveBeenCalledWith('testeKey', JSON.stringify(novoValor));
    });
});