import React, { useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Star, 
  BarChart2, 
  Folder 
} from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../constants/todoDefaults';
import { isOverdue } from '../utils/dateUtils';

export default function StatsModal({ isOpen, onClose, todos }) {
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

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const starred = todos.filter((t) => t.starred).length;
  const overdue = todos.filter((t) => !t.completed && isOverdue(t.dueDate)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Category counts
  const categoryStats = CATEGORIES.map((cat) => {
    const catTodos = todos.filter((t) => t.category === cat.id);
    const catCompleted = catTodos.filter((t) => t.completed).length;
    return {
      ...cat,
      total: catTodos.length,
      completed: catCompleted,
      pct: catTodos.length > 0 ? Math.round((catCompleted / catTodos.length) * 100) : 0
    };
  });

  // Priority counts
  const priorityStats = Object.entries(PRIORITIES).map(([key, p]) => {
    const pTodos = todos.filter((t) => t.priority === key);
    return {
      key,
      label: p.label,
      color: p.color,
      count: pTodos.length,
      active: pTodos.filter((t) => !t.completed).length
    };
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card stats-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="stats-header-title">
            <BarChart2 size={20} className="stats-title-icon" />
            <h2 className="modal-title">Productivity Insights</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body stats-body">
          {/* Key metrics grid */}
          <div className="stats-metric-grid">
            <div className="metric-box">
              <span className="metric-label">Completion Rate</span>
              <span className="metric-value">{percentage}%</span>
              <div className="metric-sub-bar">
                <div className="metric-sub-fill" style={{ width: `${percentage}%` }} />
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-row">
                <CheckCircle2 size={16} className="metric-icon success" />
                <span className="metric-label">Completed</span>
              </div>
              <span className="metric-value">{completed} <span className="metric-total">/ {total}</span></span>
            </div>

            <div className="metric-box">
              <div className="metric-row">
                <Clock size={16} className="metric-icon active" />
                <span className="metric-label">Pending</span>
              </div>
              <span className="metric-value">{active}</span>
            </div>

            <div className="metric-box">
              <div className="metric-row">
                <Star size={16} style={{ color: '#f59e0b' }} />
                <span className="metric-label">Starred</span>
              </div>
              <span className="metric-value">{starred}</span>
            </div>

            <div className="metric-box">
              <div className="metric-row">
                <AlertTriangle size={16} className="metric-icon warning" />
                <span className="metric-label">Overdue</span>
              </div>
              <span className="metric-value">{overdue}</span>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="stats-section">
            <h4 className="stats-section-title">
              <Folder size={15} />
              <span>Progress by Category</span>
            </h4>
            <div className="category-bars-list">
              {categoryStats.map((cat) => (
                <div key={cat.id} className="category-stat-row">
                  <div className="category-stat-labels">
                    <span className="category-name">
                      <span className="category-dot" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="category-count">
                      {cat.completed}/{cat.total} ({cat.pct}%)
                    </span>
                  </div>
                  <div className="category-progress-track">
                    <div
                      className="category-progress-fill"
                      style={{
                        width: `${cat.pct}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="stats-section">
            <h4 className="stats-section-title">
              <span>Task Breakdown by Priority</span>
            </h4>
            <div className="priority-stats-grid">
              {priorityStats.map((p) => (
                <div key={p.key} className="priority-stat-card" style={{ borderLeftColor: p.color }}>
                  <span className="priority-name" style={{ color: p.color }}>{p.label}</span>
                  <div className="priority-numbers">
                    <span className="priority-num">{p.count}</span>
                    <span className="priority-sub">({p.active} active)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn save-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
