import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import '../styles/ToDoApp.css';

const ToDoApp = () => {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [score, setScore] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Load state from local storage when the component mounts
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    const savedCompletedTodos = JSON.parse(localStorage.getItem('completedTodos')) || [];
    const savedScore = JSON.parse(localStorage.getItem('score')) || 0;

    console.log('Loaded todos from local storage:', savedTodos);
    console.log('Loaded completedTodos from local storage:', savedCompletedTodos);
    console.log('Loaded score from local storage:', savedScore);

    setTodos(savedTodos);
    setCompletedTodos(savedCompletedTodos);
    setScore(savedScore);
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    console.log('Saving todos to local storage:', todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    console.log('Saving completedTodos to local storage:', completedTodos);
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
  }, [completedTodos]);

  useEffect(() => {
    console.log('Saving score to local storage:', score);
    localStorage.setItem('score', JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to next midnight
    const timeToMidnight = midnight.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      setCompletedTodos([]);
      setScore(0);
      setInterval(() => {
        setCompletedTodos([]);
        setScore(0);
      }, 24 * 60 * 60 * 1000); // Reset every 24 hours
    }, timeToMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    const [completedTodo] = newTodos.splice(index, 1);
    completedTodo.completed = true;
    setTodos(newTodos);
    setCompletedTodos([...completedTodos, completedTodo]);
    setScore(score + 10); // Increment score by 10 for each completed task
    confetti(); // Add confetti effect on task completion
  };

  const startEditing = (index, text) => {
    setEditingIndex(index);
    setEditingText(text);
  };

  const saveEditing = (index) => {
    const newTodos = [...todos];
    newTodos[index].text = editingText;
    setTodos(newTodos);
    setEditingIndex(null);
    setEditingText('');
  };

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const deleteCompletedTodo = (index) => {
    const newCompletedTodos = [...completedTodos];
    newCompletedTodos.splice(index, 1);
    setCompletedTodos(newCompletedTodos);
    confetti();
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div className="todo-app">
      {/* Header Section */}
      <header>
        <h1>To Do App</h1>
      </header>

      {/* Add New Item Input and Filters Section */}
      <section className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add</button>
        <div className="filters">
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('active')}>Active</button>
          <button onClick={() => setFilter('completed')}>Completed</button>
        </div>
      </section>

      {/* To Do List Section */}
      {filter !== 'completed' && (
        <section className="todo-list">
          <h2>To Do List</h2>
          {todos.length > 0 ? (
          <ul>
            {filteredTodos.map((todo, index) => (
              <li key={index}>
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => saveEditing(index)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEditing(index);
                      }}
                    />
                    <button onClick={() => saveEditing(index)}>
                      <i className="fas fa-save"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <span>{todo.text}</span>
                    <div className="task-buttons">
                      <button className="complete" onClick={() => completeTodo(index)}>
                        <i className="fas fa-check"></i>
                      </button>
                      <button className="edit" onClick={() => startEditing(index, todo.text)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button className="delete" onClick={() => deleteTodo(index)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          ) : (
            <p className="placeholder-text">Use Add new task to add new todo item</p>
          )}
        </section>
      )}

      {/* Completed To Do List Section */}
      {filter !== 'active' && (
        <section className="completed-todo-list">
          <h2>Completed To Do List</h2>
          { completedTodos.length > 0 ? (
          <ul>
            {completedTodos.map((todo, index) => (
              <li key={index}>
                {todo.text}
                <div className="task-buttons">
                  <button className="delete" onClick={() => deleteCompletedTodo(index)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          ) : (
            <p className="placeholder-text">Completed tasks will show here.</p>
          )}
        </section>
      )}

      {/* Score Section */}
      <section className="score">
        <p>Today&rsquo;s Score: {score} <i className="fas fa-star"></i></p>
      </section>
    </div>
  );
};

export default ToDoApp;