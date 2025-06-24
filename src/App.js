import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date());
  const [todos, setTodos] = useState(['', '', '']);
  const [status, setStatus] = useState(['', '', '']);

  const formatDate = (dateObj) => {
    const offsetDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const dateStr = formatDate(date);
    const savedData = localStorage.getItem(dateStr);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTodos(parsed.todos || ['', '', '']);
        setStatus(parsed.status || ['', '', '']);
      } catch (e) {
        console.error("保存されたデータの読み込みに失敗しました:", e);
        setTodos(['', '', '']);
        setStatus(['', '', '']);
      }
    } else {
      setTodos(['', '', '']);
      setStatus(['', '', '']);
    }
  }, [date]);

  const handleTodoChange = (index, value) => {
    const newTodos = [...todos];
    newTodos[index] = value;
    setTodos(newTodos);
    localStorage.setItem(formatDate(date), JSON.stringify({ todos: newTodos, status }));
  };

  const handleStatusChange = (index, mark) => {
    const newStatus = [...status];
    newStatus[index] = mark;
    setStatus(newStatus);
    localStorage.setItem(formatDate(date), JSON.stringify({ todos, status: newStatus }));
  };

  return (
    <div className="container">
      <h1 className="title">ずぼらToDoカレンダー</h1>

      <Calendar
        onChange={(selectedDate) => {
          const adjustedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
          setDate(adjustedDate);
        }}
        value={date}
      />

      <p className="selected-date">選んだ日付: {date.toDateString()}</p>

      <h2 className="subtitle">ToDoを書く</h2>
      {todos.map((todo, index) => (
        <div key={index} className="todo-item">
          <span className="todo-index">{index + 1}. </span>
          <input
            type="text"
            value={todo}
            onChange={(e) => handleTodoChange(index, e.target.value)}
            className="todo-input"
          />
          <button className="status-button" onClick={() => handleStatusChange(index, '♡')}>♡</button>
          <button className="status-button" onClick={() => handleStatusChange(index, '×')}>×</button>
          <span className="status-mark">{status[index]}</span>
        </div>
      ))}
    </div>
  );
}

export default App;
