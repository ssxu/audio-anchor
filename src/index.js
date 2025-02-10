import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 确保 DOM 完全加载
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('找不到root元素，请检查index.html');
  }

  try {
    // 使用 ReactDOM.createRoot 而不是直接使用 createRoot
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('React渲染错误:', error);
    throw error;
  }
}); 