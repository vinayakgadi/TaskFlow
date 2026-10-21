import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ProgressBanner from './components/ProgressBanner';
import TodoInput from './components/TodoInput';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import EditTodoModal from './components/EditTodoModal';
import StatsModal from './components/StatsModal';
import ShortcutsModal from './components/ShortcutsModal';
import Toast from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_TODOS, PRIORITIES } from './constants/todoDefaults';
import { isDueToday } from './utils/dateUtils';
import { fireCelebration } from './utils/confetti';
import './App.css';

export default function App() {
  const [todos, setTodos] = useLocalStorage('taskflow_todos_v1', INITIAL_TODOS);
  const [theme, setTheme] = useLocalStorage('taskflow_theme', 'dark');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('created-desc');

  const [editingTodo, setEditingTodo] = useState(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  
  const [toast, setToast] = useState(null);
  const [deletedTodoBackup, setDeletedTodoBackup] = useState(null);
  const toastTimeoutRef = useRef(null);

  const todoInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync theme with html document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info', undoAction = null) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type, undoAction });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === 'Escape') {
        if (editingTodo) setEditingTodo(null);
        if (isStatsOpen) setIsStatsOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (searchQuery) setSearchQuery('');
        return;
      }

      if (isInputFocused) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        todoInputRef.current?.focus();
      } else if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsStatsOpen((prev) => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [editingTodo, isStatsOpen, isShortcutsOpen, searchQuery]);

  // Actions
  const handleAddTodo = (newTodoData) => {
    const newTodo = {
      id: 'task-' + Date.now() + Math.random().toString(36).substring(2, 7),
      completed: false,
      starred: false,
      createdAt: new Date().toISOString(),
      ...newTodoData
    };
    setTodos([newTodo, ...todos]);
    showToast('Task added successfully!', 'success');
  };

  const handleToggleComplete = (id) => {
    const target = todos.find((t) => t.id === id);
    const willBeCompleted = !target?.completed;

    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTodos(updated);

    // If all tasks are now complete and user just completed one, launch celebration!
    if (willBeCompleted && updated.length > 0 && updated.every((t) => t.completed)) {
      fireCelebration();
      showToast('All tasks completed! Superb work! 🎉', 'success');
    }
  };

  const handleToggleStar = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t))
    );
  };

  const handleDelete = (id) => {
    const toDelete = todos.find((t) => t.id === id);
    if (!toDelete) return;

    setDeletedTodoBackup(toDelete);
    setTodos(todos.filter((t) => t.id !== id));
    showToast(`Task deleted`, 'info', true);
  };

  const handleUndoDelete = () => {
    if (deletedTodoBackup) {
      setTodos((prev) => [deletedTodoBackup, ...prev]);
      setDeletedTodoBackup(null);
      setToast(null);
      showToast('Task restored!', 'success');
    }
  };

  const handleSaveEdit = (updatedTodo) => {
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    showToast('Task updated', 'success');
  };

  const handleToggleSubtask = (todoId, subtaskId) => {
    setTodos(
      todos.map((t) => {
        if (t.id !== todoId) return t;
        const subtasks = (t.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks };
      })
    );
  };

  const handleToggleAll = () => {
    const hasIncomplete = filteredTodos.some((t) => !t.completed);
    const filteredIds = new Set(filteredTodos.map((t) => t.id));

    const updated = todos.map((t) => {
      if (filteredIds.has(t.id)) {
        return { ...t, completed: hasIncomplete };
      }
      return t;
    });

    setTodos(updated);
    if (hasIncomplete) {
      fireCelebration();
      showToast('Marked all as completed!', 'success');
    } else {
      showToast('Marked all as pending', 'info');
    }
  };

  const handleClearCompleted = () => {
    const completedTasks = todos.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    const activeTasks = todos.filter((t) => !t.completed);
    setTodos(activeTasks);
    showToast(`Cleared ${completedTasks.length} completed ${completedTasks.length === 1 ? 'task' : 'tasks'}`, 'info');
  };

  // Export / Import / Reset
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(todos, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup downloaded as JSON', 'success');
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
          showToast(`Successfully imported ${parsed.length} tasks!`, 'success');
        } else {
          showToast('Invalid backup file format.', 'error');
        }
      } catch (error) {
        console.error('Error importing JSON:', error);
        showToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSample = () => {
    setTodos(INITIAL_TODOS);
    showToast('Restored default sample tasks', 'info');
  };

  // Derived counts for tabs
  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    today: todos.filter((t) => isDueToday(t.dueDate)).length,
    starred: todos.filter((t) => t.starred).length,
    completed: todos.filter((t) => t.completed).length
  };

  // Filter and sort todos
  const filteredTodos = todos
    .filter((item) => {
      // Tab filter
      if (activeFilter === 'active' && item.completed) return false;
      if (activeFilter === 'completed' && !item.completed) return false;
      if (activeFilter === 'starred' && !item.starred) return false;
      if (activeFilter === 'today' && !isDueToday(item.dueDate)) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Priority filter
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'created-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'created-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'due-date') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority-desc') {
        const rankA = PRIORITIES[a.priority]?.rank || 0;
        const rankB = PRIORITIES[b.priority]?.rank || 0;
        return rankB - rankA;
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="app-container">
      <div className="app-layout">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onExport={handleExport}
          onImport={handleImport}
          onResetSample={handleResetSample}
          activeCount={counts.active}
          completedCount={counts.completed}
        />

        <main className="main-content">
          <ProgressBanner
            total={counts.all}
            completed={counts.completed}
          />

          <TodoInput
            onAddTodo={handleAddTodo}
            inputRef={todoInputRef}
          />

          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
            counts={counts}
            searchInputRef={searchInputRef}
          />

          <TodoList
            todos={filteredTodos}
            totalUnfilteredCount={todos.length}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            onToggleComplete={handleToggleComplete}
            onToggleStar={handleToggleStar}
            onDelete={handleDelete}
            onEdit={setEditingTodo}
            onToggleSubtask={handleToggleSubtask}
            onToggleAll={handleToggleAll}
            onClearCompleted={handleClearCompleted}
          />
        </main>

        <footer className="app-footer">
          <p>
            TaskFlow • Designed for maximum focus & flow • Press <kbd>?</kbd> for shortcuts
          </p>
        </footer>
      </div>

      {/* Modals & Toasts */}
      <EditTodoModal
        todo={editingTodo}
        isOpen={Boolean(editingTodo)}
        onClose={() => setEditingTodo(null)}
        onSave={handleSaveEdit}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        todos={todos}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
        onUndo={handleUndoDelete}
      />
    </div>
  );
}
