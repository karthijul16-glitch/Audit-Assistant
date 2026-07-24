import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  Tag,
  Star,
  Check,
  TrendingUp,
  FolderKanban,
  AlertCircle
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: 'Design' | 'Development' | 'Marketing' | 'Research';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  starred: boolean;
}

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review user feedback and conduct UX analysis',
    category: 'Research',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-07-28',
    starred: true,
  },
  {
    id: '2',
    title: 'Update primary UI design system tokens & typography',
    category: 'Design',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2026-07-30',
    starred: false,
  },
  {
    id: '3',
    title: 'Optimize client-side state initialization and caching',
    category: 'Development',
    priority: 'High',
    status: 'Completed',
    dueDate: '2026-07-22',
    starred: true,
  },
  {
    id: '4',
    title: 'Draft Q3 feature release documentation and changelog',
    category: 'Marketing',
    priority: 'Low',
    status: 'Pending',
    dueDate: '2026-08-05',
    starred: false,
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Task['category']>('Development');
  const [newPriority, setNewPriority] = useState<Task['priority']>('Medium');
  const [newDueDate, setNewDueDate] = useState('');

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus: Task['status'] =
            t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const toggleStar = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'Pending',
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      starred: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Starred' ? t.starred : t.status === statusFilter);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased selection:bg-stone-200">
      {/* Top Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center font-bold text-lg shadow-sm">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-stone-900">
                Studio Workspace
              </h1>
              <p className="text-xs text-stone-500">Project & Task Overview</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-medium uppercase tracking-wider">Total Tasks</span>
              <LayoutDashboard className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{tasks.length}</div>
            <p className="text-xs text-stone-500">Active tracked items</p>
          </div>

          <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-medium uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{completedCount}</div>
            <p className="text-xs text-stone-500">
              {tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}% completion rate
            </p>
          </div>

          <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-medium uppercase tracking-wider">In Progress</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{inProgressCount}</div>
            <p className="text-xs text-stone-500">Currently active</p>
          </div>

          <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-medium uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{pendingCount}</div>
            <p className="text-xs text-stone-500">Awaiting start</p>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-4 h-4 text-stone-400 shrink-0 hidden sm:block" />
              {['All', 'Design', 'Development', 'Marketing', 'Research'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-stone-50'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="border-t border-stone-100 pt-3 flex items-center gap-2 overflow-x-auto">
            {['All', 'Pending', 'In Progress', 'Completed', 'Starred'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition cursor-pointer ${
                  statusFilter === st
                    ? 'border-b-2 border-stone-900 text-stone-900 font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </section>

        {/* Task List */}
        <section className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-sm font-medium text-stone-600">No tasks found</p>
              <p className="text-xs text-stone-400">
                Try adjusting your search query or active filters.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                        task.status === 'Completed'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {task.status === 'Completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <p
                        className={`text-sm font-medium leading-snug break-words ${
                          task.status === 'Completed'
                            ? 'line-through text-stone-400'
                            : 'text-stone-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center flex-wrap gap-2 text-xs text-stone-500">
                        <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-medium">
                          <Tag className="w-3 h-3" />
                          {task.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-medium ${
                            task.priority === 'High'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : task.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="inline-flex items-center gap-1 text-stone-400">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleStar(task.id)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        task.starred
                          ? 'text-amber-500 bg-amber-50'
                          : 'text-stone-300 hover:text-stone-500 hover:bg-stone-100'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${task.starred ? 'fill-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-semibold text-stone-900">Create New Task</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Task Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct usability testing on prototype"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Task['category'])}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
                  >
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Research">Research</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition cursor-pointer shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

