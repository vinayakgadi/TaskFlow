import React, { useState, useRef } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Tag, 
  Flag, 
  ListPlus, 
  X 
} from 'lucide-react';
import { PRIORITIES, CATEGORIES } from '../constants/todoDefaults';

export default function TodoInput({ onAddTodo, inputRef }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const localInputRef = useRef(null);
  const activeInputRef = inputRef || localInputRef;

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'st-' + Date.now() + Math.random().toString(36).substring(2, 6), text: subtaskInput.trim(), completed: false }
    ]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
      subtasks
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setDueDate('');
    setSubtasks([]);
    setSubtaskInput('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`todo-input-card ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="input-main-row">
          <div className="input-icon-wrap">
            <Plus size={20} className="input-add-icon" />
          </div>

          <input
            ref={activeInputRef}
            type="text"
            className="task-title-input"
            placeholder="Add a new task... (Press Enter to save)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            className={`expand-toggle-btn ${isExpanded ? 'active' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse options' : 'More options (Priority, Category, Due date)'}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <button 
            type="submit" 
            className="submit-task-btn" 
            disabled={!title.trim()}
          >
            <span>Add</span>
          </button>
        </div>

        {isExpanded && (
          <div className="input-expanded-fields">
            {/* Description textarea */}
            <div className="field-group">
              <label className="field-label">Notes / Description (Optional)</label>
              <textarea
                className="task-desc-input"
                placeholder="Add extra context, links, or notes..."
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="options-grid">
              {/* Category picker */}
              <div className="option-col">
                <label className="field-label">
                  <Tag size={13} />
                  <span>Category</span>
                </label>
                <div className="pill-selector">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      className={`pill-btn ${category === cat.id ? 'active' : ''}`}
                      style={{
                        '--pill-color': cat.color,
                        borderColor: category === cat.id ? cat.color : undefined
                      }}
                      onClick={() => setCategory(cat.id)}
                    >
                      <span className="pill-dot" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority picker */}
              <div className="option-col">
                <label className="field-label">
                  <Flag size={13} />
                  <span>Priority</span>
                </label>
                <div className="pill-selector">
                  {Object.entries(PRIORITIES).map(([key, p]) => (
                    <button
                      type="button"
                      key={key}
                      className={`pill-btn ${priority === key ? 'active' : ''}`}
                      style={{
                        '--pill-color': p.color,
                        borderColor: priority === key ? p.color : undefined
                      }}
                      onClick={() => setPriority(key)}
                    >
                      <span className="pill-dot" style={{ backgroundColor: p.color }} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date picker */}
              <div className="option-col">
                <label className="field-label">
                  <Calendar size={13} />
                  <span>Due Date</span>
                </label>
                <input
                  type="date"
                  className="date-picker-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Checklist / Subtasks section */}
            <div className="subtasks-creator-section">
              <label className="field-label">
                <ListPlus size={13} />
                <span>Checklist / Subtasks</span>
              </label>

              <div className="subtask-add-row">
                <input
                  type="text"
                  className="subtask-quick-input"
                  placeholder="Add a step or item..."
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  type="button"
                  className="subtask-add-btn"
                  onClick={handleAddSubtask}
                  disabled={!subtaskInput.trim()}
                >
                  <Plus size={14} />
                  <span>Add Step</span>
                </button>
              </div>

              {subtasks.length > 0 && (
                <ul className="subtasks-preview-list">
                  {subtasks.map((st) => (
                    <li key={st.id} className="subtask-preview-item">
                      <span>• {st.text}</span>
                      <button
                        type="button"
                        className="subtask-remove-btn"
                        onClick={() => handleRemoveSubtask(st.id)}
                        aria-label="Remove subtask"
                      >
                        <X size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
