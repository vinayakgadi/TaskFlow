# TaskFlow — Modern Todo & Task Management

A sleek, responsive, and full-featured task management application built with **React 19**, **Vite**, and **Lucide Icons**.

---

## ✨ Features

- **⚡ Fast & Intuitive Task Creation**:
  - Quick single-line task entry (press `Enter` to create).
  - Expandable detailed options for notes/descriptions, category tags, priority levels, due dates, and checklist subtasks.
- **🏷️ Categories & Priority Badging**:
  - Built-in categories: *Work*, *Personal*, *Study*, *Health*, *Finance*, and *Shopping*.
  - Priority levels with distinct color badges: *Urgent*, *High*, *Medium*, and *Low*.
- **📅 Smart Date Tracking**:
  - Dynamic relative date tags (*Today*, *Tomorrow*, formatted dates).
  - High-visibility overdue warnings for missed deadlines.
- **☑️ Interactive Subtasks / Checklists**:
  - Break complex tasks into bite-sized steps.
  - Interactive checklists right in the task card with live progress counters.
- **🔍 Search, Filter & Sort**:
  - Instant real-time search across titles and descriptions (`/` to focus).
  - Quick filter tabs: *All*, *Active*, *Today*, *Starred*, *Completed*.
  - Category and priority filter chips.
  - Sorting: *Newest First*, *Oldest First*, *Due Date (Earliest)*, *Priority (Urgent First)*, *Alphabetical (A-Z)*.
- **📊 Productivity Analytics**:
  - Live progress bar with motivational status indicators.
  - In-depth modal with completion rates, category progress breakdown, and priority statistics.
- **💾 Local Storage Persistence & Backup**:
  - Automatically persists all tasks and preferences in `localStorage`.
  - Export tasks to JSON backup file and import anytime.
  - One-click restore to sample tasks.
- **🎉 Micro-Interactions & Delights**:
  - Confetti burst when completing tasks and milestone celebrations when all tasks are done!
  - Toast notifications with quick **Undo** for deleted tasks.
- **🌗 Dark / Light Mode**:
  - Built-in theme switcher with smooth color transitions and glassmorphism styling.
- **⌨️ Keyboard Shortcuts**:
  - `N`: Quick focus new task input
  - `/`: Quick focus search bar
  - `P`: Toggle analytics modal
  - `?`: Toggle keyboard shortcuts help
  - `Esc`: Close open modal / clear search

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```

---

## 📁 Project Architecture

```
TodoList/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── EditTodoModal.jsx   # Modal for editing task details & subtasks
│   │   ├── FilterBar.jsx       # Search bar, view tabs, chips & sort
│   │   ├── Header.jsx          # App header, theme toggle, backup menu
│   │   ├── ProgressBanner.jsx  # Visual completion bar & motivational text
│   │   ├── ShortcutsModal.jsx  # Hotkeys reference guide
│   │   ├── StatsModal.jsx      # Analytics dashboard modal
│   │   ├── Toast.jsx           # Floating toast with Undo action
│   │   ├── TodoInput.jsx       # Expandable new task form
│   │   ├── TodoItem.jsx        # Individual task card with subtasks
│   │   └── TodoList.jsx        # Task list wrapper & bulk actions
│   ├── constants/
│   │   └── todoDefaults.js     # Categories, priorities & initial mock tasks
│   ├── hooks/
│   │   └── useLocalStorage.js  # React hook for localStorage sync
│   ├── utils/
│   │   ├── confetti.js         # Canvas-confetti animation triggers
│   │   └── dateUtils.js        # Relative dates & overdue detection
│   ├── App.jsx                 # Main state orchestrator
│   ├── App.css                 # Comprehensive CSS design system
│   ├── index.css               # Global typography & root resets
│   └── main.jsx                # Application root entrypoint
├── index.html
├── package.json
└── vite.config.js
```
