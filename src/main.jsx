import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ToDoApp from './components/ToDoApp';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToDoApp />
  </StrictMode>,
);