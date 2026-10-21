import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, Undo2 } from 'lucide-react';

export default function Toast({ toast, onClose, onUndo }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon-success" />,
    error: <AlertCircle size={18} className="toast-icon-error" />,
    info: <Info size={18} className="toast-icon-info" />
  };

  return (
    <div className={`toast-container toast-${toast.type || 'info'}`}>
      <div className="toast-content">
        {icons[toast.type] || icons.info}
        <span className="toast-message">{toast.message}</span>
      </div>
      <div className="toast-actions">
        {toast.undoAction && (
          <button className="toast-undo-btn" onClick={onUndo} title="Undo action">
            <Undo2 size={15} />
            <span>Undo</span>
          </button>
        )}
        <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
