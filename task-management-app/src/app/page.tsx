'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

type SortOption = 'default' | 'dueDateAsc' | 'dueDateDesc' | 'priorityHighToLow' | 'priorityLowToHigh' | 'titleAsc';

export default function TaskManagementApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Low');
  };

  const handleToggleSelect = (taskId: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    setTasks(tasks.filter(task => !selectedTasks.has(task.id)));
    setSelectedTasks(new Set());
  };

  const filteredAndSortedTasks = () => {
    let filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOption === 'dueDateAsc') {
      return [...filtered].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (sortOption === 'dueDateDesc') {
      return [...filtered].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    } else if (sortOption === 'priorityHighToLow') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return [...filtered].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (sortOption === 'priorityLowToHigh') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortOption === 'titleAsc') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return filtered;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl p-4 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold mb-4 text-center">Task Management App</h1>
        <form onSubmit={handleAddTask} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              className="w-full p-2 border rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Add Task
          </button>
        </form>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Search Tasks</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Search by title..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Sort Tasks</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-full p-2 border rounded"
          >
            <option value="default">Default</option>
            <option value="dueDateAsc">Due Date (Earliest First)</option>
            <option value="dueDateDesc">Due Date (Latest First)</option>
            <option value="priorityHighToLow">Priority (High to Low)</option>
            <option value="priorityLowToHigh">Priority (Low to High)</option>
            <option value="titleAsc">Title (A-Z)</option>
          </select>
        </div>

        <button 
          type="button" 
          onClick={handleDeleteSelected}
          className="mb-4 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors flex items-center justify-center"
          disabled={selectedTasks.size === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round">
            <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" />
            <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" />
          </svg>
        </button>

        <div className="space-y-4">
          {filteredAndSortedTasks().map((task) => (
            <div key={task.id} className="p-4 border rounded shadow-sm flex items-start">
              <input
                type="checkbox"
                checked={selectedTasks.has(task.id)}
                onChange={() => handleToggleSelect(task.id)}
                className="mr-2 mt-1"
              />
              <div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p>{task.description}</p>
                <p>Due: {task.dueDate}</p>
                <p>Priority: 
                  <span className={`ml-2 inline-block px-2 py-1 text-sm rounded 
                    ${task.priority === 'High' ? 'bg-red-200 text-red-800' : 
                      task.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 
                      'bg-green-200 text-green-800'}`}>
                    {task.priority}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
