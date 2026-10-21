import React from 'react';
import { 
  Inbox, 
  CheckCheck, 
  Trash, 
  Sparkles, 
  SearchX, 
  StarOff 
} from 'lucide-react';
import TodoItem from './TodoItem';

export default function TodoList({
  todos,
  totalUnfilteredCount,
  activeFilter,
  searchQuery,
  onToggleComplete,
  onToggleStar,
  onDelete,
  onEdit,
  onToggleSubtask,
  onToggleAll,
  onClearCompleted
}) {
  const completedInFiltered = todos.filter((t) => t.completed).length;
  const activeInFiltered = todos.length - completedInFiltered;
  const hasCompletedInFiltered = completedInFiltered > 0;
  const allInFilteredCompleted = todos.length > 0 && activeInFiltered === 0;

  if (todos.length === 0) {
    let emptyIcon = <Inbox size={48} className="empty-icon" />;
    let emptyTitle = "No tasks found";
    let emptyDesc = "You have no tasks matching this criteria.";

    if (searchQuery) {
      emptyIcon = <SearchX size={48} className="empty-icon" />;
      emptyTitle = `No results for "${searchQuery}"`;
      emptyDesc = "Try searching for a different keyword or clear your filters.";
    } else if (activeFilter === 'completed') {
      emptyIcon = <CheckCheck size={48} className="empty-icon" />;
      emptyTitle = "No completed tasks yet";
      emptyDesc = "Finish a task from your active list to see it here!";
    } else if (activeFilter === 'starred') {
      emptyIcon = <StarOff size={48} className="empty-icon" />;
      emptyTitle = "No starred tasks";
      emptyDesc = "Star important tasks to keep them handy here.";
    } else if (activeFilter === 'today') {
      emptyIcon = <Sparkles size={48} className="empty-icon" />;
      emptyTitle = "Nothing due today";
      emptyDesc = "Take a breather or schedule a task for today.";
    } else if (totalUnfilteredCount === 0) {
      emptyIcon = <Sparkles size={48} className="empty-icon" />;
      emptyTitle = "Your to-do list is clean!";
      emptyDesc = "Add your first task above to start organizing your day.";
    }

    return (
      <div className="empty-state-card">
        {emptyIcon}
        <h3 className="empty-title">{emptyTitle}</h3>
        <p className="empty-desc">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="todo-list-wrapper">
      <div className="todo-items-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onToggleStar={onToggleStar}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleSubtask={onToggleSubtask}
          />
        ))}
      </div>

      {/* Bulk action toolbar */}
      <div className="bulk-actions-bar">
        <span className="items-left-text">
          <strong>{activeInFiltered}</strong> {activeInFiltered === 1 ? 'task' : 'tasks'} remaining
        </span>

        <div className="bulk-buttons">
          <button
            type="button"
            className="bulk-btn"
            onClick={onToggleAll}
            title={allInFilteredCompleted ? 'Mark all incomplete' : 'Mark all completed'}
          >
            <CheckCheck size={14} />
            <span>{allInFilteredCompleted ? 'Uncheck All' : 'Check All'}</span>
          </button>

          {hasCompletedInFiltered && (
            <button
              type="button"
              className="bulk-btn bulk-btn-danger"
              onClick={onClearCompleted}
              title="Delete all completed tasks in this view"
            >
              <Trash size={14} />
              <span>Clear Completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
