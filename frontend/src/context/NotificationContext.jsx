// src/context/NotificationContext.jsx
import React, { createContext, useContext } from 'react';
import { Toast } from 'bootstrap';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const showSuccessToast = (message = 'Успех!') => {
    const toastEl = document.getElementById('successToast');
    if (!toastEl) return;
    toastEl.querySelector('.toast-body').textContent = message;
    const bsToast = new Toast(toastEl, { autohide: true, delay: 3000 });
    bsToast.show();
  };

  const showErrorToast = (message = 'Произошла ошибка.') => {
    const toastEl = document.getElementById('errorToast');
    if (!toastEl) return;
    toastEl.querySelector('.toast-body').textContent = message;
    const bsToast = new Toast(toastEl, { autohide: true, delay: 5000 });
    bsToast.show();
    console.error(message);
  };

  return (
    <NotificationContext.Provider value={{ showSuccessToast, showErrorToast }}>
      {/* Toast уведомления */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {/* Success Toast */}
        <div id="successToast" className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">Успех!</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
          </div>
        </div>

        {/* Error Toast */}
        <div id="errorToast" className="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">Ошибка!</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
          </div>
        </div>
      </div>

      {children}
    </NotificationContext.Provider>
  );
};