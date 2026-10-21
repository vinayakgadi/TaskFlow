import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckSquare, 
  Sun, 
  Moon, 
  BarChart3, 
  Keyboard, 
  Download, 
  Upload, 
  RotateCcw, 
  MoreVertical 
} from 'lucide-react';

function getFormattedDate() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());
}

export default function Header({ 
  theme, 
  toggleTheme, 
  onOpenStats, 
  onOpenShortcuts, 
  onExport, 
  onImport, 
  onResetSample,
  activeCount
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [todayFormatted] = useState(getFormattedDate);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close dropdown menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
      setMenuOpen(false);
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-badge">
          <CheckSquare className="logo-icon" size={26} />
        </div>
        <div className="header-titles">
          <div className="title-row">
            <h1 className="app-title">TaskFlow</h1>
            <span className="version-pill">v1.0</span>
          </div>
          <p className="header-subtitle">
            {todayFormatted} • <span className="highlight-count">{activeCount} pending</span>
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button 
          className="header-btn" 
          onClick={onOpenStats} 
          title="Productivity Insights (P)"
          aria-label="View statistics"
        >
          <BarChart3 size={18} />
          <span className="btn-label">Analytics</span>
        </button>

        <button 
          className="header-btn" 
          onClick={onOpenShortcuts} 
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard size={18} />
        </button>

        <button 
          className="header-btn theme-toggle-btn" 
          onClick={toggleTheme} 
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
        </button>

        <div className="menu-container" ref={menuRef}>
          <button 
            className={`header-btn icon-only-btn ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            title="More Options"
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              <button 
                className="dropdown-item" 
                onClick={() => {
                  onExport();
                  setMenuOpen(false);
                }}
              >
                <Download size={16} />
                <span>Export Tasks (JSON)</span>
              </button>

              <button 
                className="dropdown-item" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                <span>Import Tasks (JSON)</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                style={{ display: 'none' }} 
              />

              <div className="dropdown-divider" />

              <button 
                className="dropdown-item dropdown-danger" 
                onClick={() => {
                  onResetSample();
                  setMenuOpen(false);
                }}
              >
                <RotateCcw size={16} />
                <span>Reset to Sample Tasks</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
