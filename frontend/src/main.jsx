import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));

// could benift from using a basepage, that renders components that every page has by default and then
// rendering specifc elements when a user clicks a button or a nav link that takes them to a specific page 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
