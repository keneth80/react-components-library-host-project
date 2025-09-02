import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // 확장자를 .tsx로 명시

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
