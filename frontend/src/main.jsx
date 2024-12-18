import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ModalProvider, Modal } from './context/Modal';
import { restoreCSRF, csrfFetch } from './store/csrf';
import App from './App.jsx';
import configureStore from './store/store';
import * as sessionActions from './store/session';


const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  
}

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider> 
        <App />
        <Modal />
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);

