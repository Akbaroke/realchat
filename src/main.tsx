import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'sonner';
import Container from './components/templates/Container.tsx';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Container>
        <Toaster richColors position="top-center" />
        <App />
      </Container>
    </Provider>
  </React.StrictMode>
);
