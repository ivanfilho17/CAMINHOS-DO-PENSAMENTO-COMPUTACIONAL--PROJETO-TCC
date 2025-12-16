import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch" htmlFor="checkbox-theme">
        <input 
          type="checkbox" 
          id="checkbox-theme" 
          checked={isDark} 
          onChange={toggleTheme} 
        />
        <div className="slider round">
          {/* Ícone de Sol (Claro - Esquerda) */}
          <span className="icon-sun">☀️</span>
          
          {/* Ícone de Lua (Escuro - Direita) */}
          <span className="icon-moon">🌙</span>
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;