export const PRIORITIES = {
  urgent: {
    label: 'Urgent',
    value: 'urgent',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    rank: 4
  },
  high: {
    label: 'High',
    value: 'high',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.3)',
    rank: 3
  },
  medium: {
    label: 'Medium',
    value: 'medium',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.3)',
    rank: 2
  },
  low: {
    label: 'Low',
    value: 'low',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    rank: 1
  }
};

export const CATEGORIES = [
  { id: 'work', name: 'Work', color: '#6366f1', icon: 'Briefcase' },
  { id: 'personal', name: 'Personal', color: '#ec4899', icon: 'User' },
  { id: 'study', name: 'Study', color: '#8b5cf6', icon: 'BookOpen' },
  { id: 'health', name: 'Health', color: '#10b981', icon: 'HeartPulse' },
  { id: 'finance', name: 'Finance', color: '#f59e0b', icon: 'DollarSign' },
  { id: 'shopping', name: 'Shopping', color: '#06b6d4', icon: 'ShoppingCart' }
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const formatDateStr = (d) => d.toISOString().split('T')[0];

export const INITIAL_TODOS = [
  {
    id: 'demo-1',
    title: 'Review project architecture & design docs',
    description: 'Ensure system specs and API models align with business requirements.',
    category: 'work',
    priority: 'urgent',
    dueDate: formatDateStr(today),
    completed: false,
    starred: true,
    subtasks: [
      { id: 'sub-1', text: 'Review database schemas', completed: true },
      { id: 'sub-2', text: 'Validate auth flow security', completed: false },
      { id: 'sub-3', text: 'Draft API documentation', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'demo-2',
    title: 'Daily 30-minute cardio & strength workout',
    description: 'Stay consistent with fitness goals. Hydrate well!',
    category: 'health',
    priority: 'high',
    dueDate: formatDateStr(today),
    completed: true,
    starred: false,
    subtasks: [
      { id: 'sub-4', text: '5 min stretching', completed: true },
      { id: 'sub-5', text: '20 min interval running', completed: true },
      { id: 'sub-6', text: 'Cooldown exercises', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'demo-3',
    title: 'Complete React 19 concurrent features module',
    description: 'Read the official docs on Server Components, Actions, and useOptimistic hook.',
    category: 'study',
    priority: 'medium',
    dueDate: formatDateStr(tomorrow),
    completed: false,
    starred: true,
    subtasks: [],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'demo-4',
    title: 'Grocery shopping for weekly meal prep',
    description: 'Fresh fruits, vegetables, almond milk, oat grains, and olive oil.',
    category: 'shopping',
    priority: 'low',
    dueDate: '',
    completed: false,
    starred: false,
    subtasks: [
      { id: 'sub-7', text: 'Avocados & Spinach', completed: false },
      { id: 'sub-8', text: 'Almond milk & Greek yogurt', completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];
