import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProgressBanner({ total, completed }) {
  if (total === 0) {
    return (
      <div className="progress-banner-empty">
        <Sparkles size={18} className="sparkle-icon" />
        <span>No tasks scheduled yet. Start by adding one below!</span>
      </div>
    );
  }

  const percentage = Math.round((completed / total) * 100);

  let message = "Let's make today count! ✨";
  if (percentage === 100) {
    message = "Outstanding! All tasks crushed for today! 🎉";
  } else if (percentage >= 75) {
    message = "Almost at the finish line! Keep going! 🚀";
  } else if (percentage >= 50) {
    message = "Halfway through! Great momentum! 💪";
  } else if (percentage > 0) {
    message = "Off to a productive start! ⚡";
  }

  return (
    <div className="progress-card">
      <div className="progress-header">
        <div className="progress-title-wrap">
          <CheckCircle2 size={18} className="progress-status-icon" />
          <span className="progress-message">{message}</span>
        </div>
        <div className="progress-score">
          <span className="score-completed">{completed}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{total}</span>
          <span className="score-percent">({percentage}%)</span>
        </div>
      </div>

      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
