import React, { useState } from 'react';
import { 
  Check, 
  Star, 
  Trash2, 
  Edit3, 
  Calendar, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { PRIORITIES, CATEGORIES } from '../constants/todoDefaults';
import { formatRelativeDate, isOverdue } from '../utils/dateUtils';
import { fireMiniBurst } from '../utils/confetti';

export default function TodoItem({
  todo,
  onToggleComplete,
  onToggleStar,
  onDelete,
  onEdit,
  onToggleSubtask
}) {
  const [subtasksOpen, setSubtasksOpen] = useState(false);

  const priorityMeta = PRIORITIES[todo.priority] || PRIORITIES.medium;
  const categoryMeta = CATEGORIES.find((c) => c.id === todo.category) || CATEGORIES[0];
  const relativeDate = formatRelativeDate(todo.dueDate);
  const overdue = !todo.completed && isOverdue(todo.dueDate);

  const totalSubtasks = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter((st) => st.completed).length || 0;

  const handleToggle = (e) => {
    if (!todo.completed) {
      // Trigger a mini burst at the toggle position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      fireMiniBurst(x, y);
    }
    onToggleComplete(todo.id);
  };

  return (
    <div className={`todo-card ${todo.completed ? 'completed' : ''} ${todo.starred ? 'starred' : ''}`}>
      <div className="todo-main-content">
        {/* Completion checkbox */}
        <button
          className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          title={todo.completed ? 'Mark incomplete' : 'Mark completed'}
          aria-label="Toggle completion"
        >
          {todo.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Task Details */}
        <div className="todo-body">
          <div className="todo-title-row">
            <span className="todo-title">{todo.title}</span>
          </div>

          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}

          {/* Badges row */}
          <div className="todo-meta-row">
            {/* Category tag */}
            <span 
              className="meta-badge category-badge" 
              style={{
                color: categoryMeta.color,
                backgroundColor: `${categoryMeta.color}18`,
                borderColor: `${categoryMeta.color}35`
              }}
            >
              <span className="badge-dot" style={{ backgroundColor: categoryMeta.color }} />
              {categoryMeta.name}
            </span>

            {/* Priority tag */}
            <span 
              className="meta-badge priority-badge"
              style={{
                color: priorityMeta.color,
                backgroundColor: priorityMeta.bg,
                borderColor: priorityMeta.border
              }}
            >
              {priorityMeta.label}
            </span>

            {/* Due date tag */}
            {relativeDate && (
              <span className={`meta-badge date-badge ${overdue ? 'overdue' : ''}`}>
                {overdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                <span>{relativeDate.text}</span>
              </span>
            )}

            {/* Subtasks counter badge if any */}
            {totalSubtasks > 0 && (
              <button
                type="button"
                className="meta-badge subtasks-badge"
                onClick={() => setSubtasksOpen(!subtasksOpen)}
                title="Toggle subtasks checklist"
              >
                <span>{completedSubtasks}/{totalSubtasks} steps</span>
                {subtasksOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        </div>

        {/* Action icons right */}
        <div className="todo-actions">
          <button
            className={`action-icon-btn star-btn ${todo.starred ? 'active' : ''}`}
            onClick={() => onToggleStar(todo.id)}
            title={todo.starred ? 'Unstar task' : 'Star task'}
            aria-label="Star task"
          >
            <Star size={16} fill={todo.starred ? 'currentColor' : 'none'} />
          </button>

          <button
            className="action-icon-btn edit-btn"
            onClick={() => onEdit(todo)}
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit3 size={16} />
          </button>

          <button
            className="action-icon-btn delete-btn"
            onClick={() => onDelete(todo.id)}
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable subtasks checklist */}
      {subtasksOpen && totalSubtasks > 0 && (
        <div className="subtasks-container">
          <div className="subtasks-header">
            <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
          </div>
          <ul className="subtasks-interactive-list">
            {todo.subtasks.map((st) => (
              <li 
                key={st.id} 
                className={`subtask-interactive-item ${st.completed ? 'completed' : ''}`}
                onClick={() => onToggleSubtask(todo.id, st.id)}
              >
                <button 
                  type="button" 
                  className="subtask-checkbox" 
                  aria-label="Toggle subtask"
                >
                  {st.completed ? (
                    <CheckSquare size={14} className="subtask-checked-icon" />
                  ) : (
                    <Square size={14} />
                  )}
                </button>
                <span className="subtask-text">{st.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
