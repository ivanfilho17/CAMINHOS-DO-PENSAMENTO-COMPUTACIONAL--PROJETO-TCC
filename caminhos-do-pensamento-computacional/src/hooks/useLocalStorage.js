// Hook personalizado para persistir dados no localStorage

import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Estado para armazenar o valor
  // Passa a função inicial ao useState para que a lógica seja executada apenas uma vez
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Obtém do local storage pela chave
      const item = window.localStorage.getItem(key);
      // Analisa o JSON armazenado ou retorna initialValue se não houver nada
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao carregar localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Retorna uma versão envolvida da função setter do useState que...
  // ...persiste o novo valor no localStorage.
  const setValue = (value) => {
    try {
      // Permite que value seja uma função como no useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salva o estado
      setStoredValue(valueToStore);
      // Salva no local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erro ao salvar localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}