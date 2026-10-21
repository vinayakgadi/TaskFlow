import React from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Star, 
  CheckCircle2, 
  ListFilter, 
  Clock, 
  Flame 
} from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../constants/todoDefaults';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  sortBy,
  setSortBy,
  counts,
  searchInputRef
}) {
  const tabs = [
    { id: 'all', label: 'All Tasks', count: counts.all, icon: ListFilter },
    { id: 'active', label: 'Active', count: counts.active, icon: Clock },
    { id: 'today', label: 'Today', count: counts.today, icon: Flame },
    { id: 'starred', label: 'Starred', count: counts.starred, icon: Star },
    { id: 'completed', label: 'Completed', count: counts.completed, icon: CheckCircle2 }
  ];

  return (
    <div className="filter-bar-wrapper">
      {/* Top row: Search input & Sorting */}
      <div className="filter-top-row">
        <div className="search-input-box">
          <Search size={16} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search tasks by title or note... (/ to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="sort-box">
          <label className="sort-label">
            <SlidersHorizontal size={14} />
            <span>Sort:</span>
          </label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="due-date">Due Date (Earliest)</option>
            <option value="priority-desc">Priority (Urgent First)</option>
            <option value="title-asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="filter-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              className={`filter-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              <Icon size={15} className="tab-icon" />
              <span className="tab-label">{tab.label}</span>
              <span className="tab-badge">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary filter chips row: Categories & Priority */}
      <div className="chips-filter-row">
        <div className="chips-group">
          <span className="chips-group-title">Category:</span>
          <button
            className={`chip-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`chip-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              style={{
                '--chip-color': cat.color
              }}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id)}
            >
              <span className="chip-dot" style={{ backgroundColor: cat.color }} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="chips-group priority-chips">
          <span className="chips-group-title">Priority:</span>
          <button
            className={`chip-btn ${selectedPriority === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedPriority('all')}
          >
            All
          </button>
          {Object.entries(PRIORITIES).map(([key, p]) => (
            <button
              key={key}
              className={`chip-btn ${selectedPriority === key ? 'active' : ''}`}
              style={{
                '--chip-color': p.color
              }}
              onClick={() => setSelectedPriority(key === selectedPriority ? 'all' : key)}
            >
              <span className="chip-dot" style={{ backgroundColor: p.color }} />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
