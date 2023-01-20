/* istanbul ignore file */
/* above leaves this file out of the jest test coverage check as we can't test index.js */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './context/userContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
);
