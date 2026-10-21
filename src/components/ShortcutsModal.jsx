import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', desc: 'Focus task input field' },
    { key: '/', desc: 'Focus search bar' },
    { key: 'P', desc: 'Open productivity analytics' },
    { key: '?', desc: 'Toggle keyboard shortcuts guide' },
    { key: 'Ctrl + Enter', desc: 'Quick save task in edit modal' },
    { key: 'Esc', desc: 'Close open dialogs or clear search' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card shortcuts-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="stats-header-title">
            <Keyboard size={20} className="stats-title-icon" />
            <h2 className="modal-title">Keyboard Shortcuts</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="shortcuts-list">
            {shortcuts.map((item, idx) => (
              <div key={idx} className="shortcut-row">
                <span className="shortcut-desc">{item.desc}</span>
                <kbd className="shortcut-key">{item.key}</kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn save-btn" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
