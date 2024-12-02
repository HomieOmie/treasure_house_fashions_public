import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootNode: HTMLElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootNode);
root.render(
    <App/>
);
