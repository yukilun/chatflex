import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.scss';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext.js';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <App />
    </ChatContextProvider>
  </AuthContextProvider>
);