import React, { useState, useEffect } from 'react';
import './App.css'; // Importation du fichier CSS

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Général');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');


  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { text: newTask, category, dueDate, completed: false },
      ]);
      setNewTask('');
      setCategory('Général');
      setDueDate('');
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  }).filter((task) => task.text.toLowerCase().includes(search.toLowerCase()));

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    remaining: tasks.filter((task) => !task.completed).length,
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.querySelector('.app').classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.querySelector('.app').classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="app">
      <h1>To-Do List 
        {/* <label class="ui-switch">
          <input type="checkbox"></input>
          <div class="slider">
            <div class="circle"></div>
          </div>
        </label> */}
        <label className="ui-switch">
          <input 
            type="checkbox" 
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <div className="slider">
            <div className="circle"></div>
          </div>
        </label>

        </h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Ajouter une tâche..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Général">Général</option>
          <option value="Travail">Travail</option>
          <option value="Personnel">Personnel</option>
          <option value="Loisirs">Loisirs</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Ajouter</button>
      </div>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          En cours
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Terminées
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task, index) => {
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
          return (
            <li
              key={index}
              className={`${task.completed ? 'completed' : ''} ${task.priority ? 'priority' : ''} ${isOverdue ? 'overdue' : ''}`}
            >
              <div className="task-info">
                <span>{task.text}</span>
                <span className="category">[{task.category}]</span>
                {task.dueDate && <span className="due-date">{isOverdue ? '⚠️' : '📅'} {task.dueDate}</span>}
              </div>
              <div className="task-actions">
                <button className="complete" onClick={() => toggleTask(index)}>
                  {task.completed ? 'Reprendre' : 'Terminer'}
                </button>
                <button className="delete" onClick={() => deleteTask(index)}>
                  Supprimer
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="task-stats">
        <p>Total de tâches: {taskStats.total}</p>
        <p>Tâches terminées: {taskStats.completed}</p>
        <p>Tâches restantes: {taskStats.remaining}</p>
      </div>
    </div>
  );
}

export default App;
