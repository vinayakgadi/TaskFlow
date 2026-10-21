import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Tag, 
  Flag, 
  Calendar, 
  ListPlus, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../constants/todoDefaults';

function EditTodoContent({ todo, onClose, onSave }) {
  const [title, setTitle] = useState(todo.title || '');
  const [description, setDescription] = useState(todo.description || '');
  const [category, setCategory] = useState(todo.category || 'work');
  const [priority, setPriority] = useState(todo.priority || 'medium');
  const [dueDate, setDueDate] = useState(todo.dueDate || '');
  const [subtasks, setSubtasks] = useState(todo.subtasks ? [...todo.subtasks] : []);
  const [newSubtask, setNewSubtask] = useState('');

  const onSaveRef = useRef(onSave);
  const onCloseRef = useRef(onClose);
  const currentValuesRef = useRef({ title, description, category, priority, dueDate, subtasks, todo });

  useEffect(() => {
    onSaveRef.current = onSave;
    onCloseRef.current = onClose;
    currentValuesRef.current = { title, description, category, priority, dueDate, subtasks, todo };
  });

  const handleSave = () => {
    if (!title.trim()) return;
    onSaveRef.current({
      ...todo,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
      subtasks
    });
    onCloseRef.current();
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCloseRef.current();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        const curr = currentValuesRef.current;
        if (!curr.title.trim()) return;
        onSaveRef.current({
          ...curr.todo,
          title: curr.title.trim(),
          description: curr.description.trim(),
          category: curr.category,
          priority: curr.priority,
          dueDate: curr.dueDate,
          subtasks: curr.subtasks
        });
        onCloseRef.current();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: 'st-' + Date.now() + Math.random().toString(36).substring(2, 6),
        text: newSubtask.trim(),
        completed: false
      }
    ]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleToggleSubtask = (id) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Task</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="field-group">
            <label className="field-label">Task Title</label>
            <input
              type="text"
              className="task-title-input modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="field-group">
            <label className="field-label">Description / Notes</label>
            <textarea
              className="task-desc-input modal-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional details..."
            />
          </div>

          <div className="options-grid">
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

            <div className="option-col">
              <label className="field-label">
                <Calendar size={13} />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                className="date-picker-input modal-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="subtasks-creator-section modal-subtasks">
            <label className="field-label">
              <ListPlus size={13} />
              <span>Subtasks / Steps</span>
            </label>

            <div className="subtask-add-row">
              <input
                type="text"
                className="subtask-quick-input"
                placeholder="Add subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
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
                disabled={!newSubtask.trim()}
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {subtasks.length > 0 && (
              <ul className="subtasks-preview-list">
                {subtasks.map((st) => (
                  <li key={st.id} className="subtask-preview-item">
                    <label className="subtask-checkbox-label">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleToggleSubtask(st.id)}
                      />
                      <span className={st.completed ? 'completed-text' : ''}>{st.text}</span>
                    </label>
                    <button
                      type="button"
                      className="subtask-remove-btn"
                      onClick={() => handleRemoveSubtask(st.id)}
                      aria-label="Delete step"
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="modal-btn save-btn" 
            onClick={handleSave} 
            disabled={!title.trim()}
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditTodoModal({ todo, isOpen, onClose, onSave }) {
  if (!isOpen || !todo) return null;
  return <EditTodoContent key={todo.id} todo={todo} onClose={onClose} onSave={onSave} />;
}
