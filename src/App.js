import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'todo' });
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  // Загрузка задач из localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Сохранение задач в localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Добавление задачи
  const addTask = () => {
    if (newTask.title.trim() === '') return;
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', status: 'todo' });
  };

  // Фильтрация задач
  const getFilteredTasks = () => {
    switch (filter) {
      case 'todo':
        return tasks.filter(task => task.status === 'todo');
      case 'inProgress':
        return tasks.filter(task => task.status === 'inProgress');
      case 'done':
        return tasks.filter(task => task.status === 'done');
      case 'high':
        return tasks.filter(task => task.priority === 'high');
      case 'medium':
        return tasks.filter(task => task.priority === 'medium');
      case 'low':
        return tasks.filter(task => task.priority === 'low');
      default:
        return tasks;
    }
  };

  // Обновление задачи
  const updateTask = () => {
    if (!editingTask || editingTask.title.trim() === '') return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  // Удаление задачи
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Изменение статуса задачи
  const changeStatus = (id, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Таск-трекер</h1>
      </header>

      <div className="container">
        {/* Форма добавления/редактирования */}
        <div className="task-form">
          <h2>{editingTask ? 'Редактировать задачу' : 'Добавить новую задачу'}</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Название задачи*"
              value={editingTask ? editingTask.title : newTask.title}
              onChange={(e) => editingTask 
                ? setEditingTask({...editingTask, title: e.target.value})
                : setNewTask({...newTask, title: e.target.value})
              }
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Описание задачи"
              value={editingTask ? editingTask.description : newTask.description}
              onChange={(e) => editingTask
                ? setEditingTask({...editingTask, description: e.target.value})
                : setNewTask({...newTask, description: e.target.value})
              }
            />
          </div>
          
          <div className="form-row">
            <div className="form-column">
              <label className="form-label">Выберите приоритет:</label>
              <select
                value={editingTask ? editingTask.priority : newTask.priority}
                onChange={(e) => editingTask
                  ? setEditingTask({...editingTask, priority: e.target.value})
                  : setNewTask({...newTask, priority: e.target.value})
                }
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
            
            <div className="form-column">
              <label className="form-label">Выберите статус:</label>
              <select
                value={editingTask ? editingTask.status : newTask.status}
                onChange={(e) => editingTask
                  ? setEditingTask({...editingTask, status: e.target.value})
                  : setNewTask({...newTask, status: e.target.value})
                }
              >
                <option value="todo">К выполнению</option>
                <option value="inProgress">В работе</option>
                <option value="done">Выполнено</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            {editingTask ? (
              <>
                <button className="btn btn-primary" onClick={updateTask}>
                  Сохранить
                </button>
                <button className="btn btn-secondary" onClick={() => setEditingTask(null)}>
                  Отмена
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={addTask}>
                Добавить задачу
              </button>
            )}
          </div>
        </div>

        {/* Фильтры */}
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все задачи
          </button>
          <button 
            className={`filter-btn ${filter === 'todo' ? 'active' : ''}`}
            onClick={() => setFilter('todo')}
          >
            К выполнению
          </button>
          <button 
            className={`filter-btn ${filter === 'inProgress' ? 'active' : ''}`}
            onClick={() => setFilter('inProgress')}
          >
            В работе
          </button>
          <button 
            className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
          >
            Выполнено
          </button>
        </div>

        {/* Список задач */}
        <div className="tasks-list">
          <h2>Список задач ({filteredTasks.length})</h2>
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>Задачи не найдены</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <div key={task.id} className={`task-card ${task.priority} ${task.status}`}>
                  <div className="task-content">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <span className={`priority-badge ${task.priority}`}>
                        {task.priority === 'high' ? 'Высокий' : 
                         task.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    
                    <div className="task-meta">
                      <span className="task-date">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`status-badge ${task.status}`}>
                        {task.status === 'todo' ? 'К выполнению' :
                         task.status === 'inProgress' ? 'В работе' : 'Выполнено'}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <select 
                      value={task.status} 
                      onChange={(e) => changeStatus(task.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="todo">К выполнению</option>
                      <option value="inProgress">В работе</option>
                      <option value="done">Выполнено</option>
                    </select>
                    
                    <button 
                      className="btn btn-edit"
                      onClick={() => setEditingTask(task)}
                    >
                      ✏️
                    </button>
                    
                    <button 
                      className="btn btn-delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;