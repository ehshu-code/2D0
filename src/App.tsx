import React, { useEffect, useRef, useState } from 'react';
import 'terminal.css';
import './App.css';
import {
  handleArrowDown, handleArrowUp,
  handleInputEnter, handleTaskComplete, handleTaskDelete
} from './handlers';

export interface Task {
  text: string;
  completed: boolean;
}

const COLOURS = ['#7AF8CA', '#C099FF', '#FF98A4', '#65BCFF', '#FC946B'];

type Selection = 'input' | number;

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const taskRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [tasks, setTasks] = useState<Task[]>([
    { text: "Welcome to 2D0 — start typing...", completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selected, setSelected] = useState<Selection>('input');

  // useEffect: Focus selected element
  useEffect(() => {
    if (selected === 'input') inputRef.current?.focus();
    else if (typeof selected === 'number') taskRefs.current[selected]?.focus();
  }, [selected]);

  // useEffect: Make sure taskRefs only contains refs for existing tasks
  useEffect(() => {
    taskRefs.current = taskRefs.current.slice(0, tasks.length);
  }, [tasks]);

  const addTask = (text: string) => {
    if (!text.trim()) return;
    setTasks(prev => [...prev, { text, completed: false }]);
  };

  // Allows for navigation, entering, completing and deleting tasks.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        handleArrowDown(selected, setSelected, tasks);
        break;
      case 'ArrowUp':
        handleArrowUp(selected, setSelected, tasks);
        break;
      case 'Enter':
        if (selected === 'input') handleInputEnter(inputValue, addTask, setInputValue);
        else if (typeof selected === 'number') handleTaskComplete(selected, tasks, setTasks);
        break;
      case 'Backspace':
        if (typeof selected === 'number') handleTaskDelete(tasks, setTasks, selected, setSelected);
        break;
    }
  };

  // Measures for progress bar
  const completedCount = tasks.filter(task => task.completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="terminal" tabIndex={0} onKeyDown={handleKeyDown}>
      <h1>[2D0]</h1>
      <h6>A to-do list for flow state programmers. Full control from keyboard.</h6>
      <div className="keyboard-legend">
        <span className="key">↑</span>/<span className="key">↓</span> navigate&nbsp;&nbsp;
        <span className="key">return</span> complete&nbsp;&nbsp;
        <span className="key">delete</span> delete
      </div>
      <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
      {progressPercent === 100 && (
        <p className="affirmation">
          You have completed all tasks. rm -rf stress.
        </p>
      )}      <div className="task-list">
        {tasks.map((task, index) => (
          <div
            key={index}
            ref={el => { taskRefs.current[index] = el }}
            className={`terminal-card color-${index % COLOURS.length} 
              ${selected === index ? 'selected' : ''} 
              ${task.completed ? 'completed strike show-check' : ''}`}
            tabIndex={-1}
            onClick={() => setSelected(index)}
          >
            <p>
              <span className="task-number">{index + 1}.</span>
              <span className="task-text"> {task.text}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="input-row">
        <span>{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onClick={() => setSelected('input')}
          placeholder="Type a new task..."
          className={selected === 'input' ? 'selected-input' : ''}
        />
      </div>
    </div>
  );
}

export default App;
