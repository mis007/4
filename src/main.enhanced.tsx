// 演示版主入口 - 独立于原有的main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppEnhanced from './AppEnhanced';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppEnhanced />
  </React.StrictMode>
);
