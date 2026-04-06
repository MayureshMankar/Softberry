import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeTest: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      color: colors.text.primary, 
      padding: '20px', 
      margin: '20px 0',
      border: `1px solid ${colors.border}`,
      borderRadius: '8px'
    }}>
      <h3>Theme Test Component</h3>
      <p>Current theme: <strong>{theme}</strong></p>
      <button 
        onClick={toggleTheme}
        style={{
          backgroundColor: colors.accent,
          color: colors.background,
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Toggle Theme
      </button>
      
      <div style={{ marginTop: '15px' }}>
        <h4>Color Palette Preview:</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ 
              width: '100px', 
              height: '30px', 
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`
            }}></div>
            <p style={{ fontSize: '12px' }}>Background</p>
          </div>
          <div>
            <div style={{ 
              width: '100px', 
              height: '30px', 
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}></div>
            <p style={{ fontSize: '12px' }}>Surface</p>
          </div>
          <div>
            <div style={{ 
              width: '100px', 
              height: '30px', 
              backgroundColor: colors.text.primary,
              border: `1px solid ${colors.border}`
            }}></div>
            <p style={{ fontSize: '12px', color: colors.text.primary }}>Text Primary</p>
          </div>
          <div>
            <div style={{ 
              width: '100px', 
              height: '30px', 
              backgroundColor: colors.accent,
              border: `1px solid ${colors.border}`
            }}></div>
            <p style={{ fontSize: '12px' }}>Accent</p>
          </div>
        </div>
      </div>
    </div>
  );
};