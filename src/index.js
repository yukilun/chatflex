import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.scss';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <App />
    </ChatContextProvider>
  </AuthContextProvider>
);