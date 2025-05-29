import React, { useState } from 'react';
import styles from './TodoItem.module.css';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, editTitle);
    }
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  return (
    <div className={`${styles.todoItem} ${todo.completed ? styles.todoItemCompleted : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, todo.completed)}
        className={styles.checkbox}
      />

      <span className={styles.todoId}>#{todo.id}</span>

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          className={`${styles.input} ${styles.editInput}`}
          autoFocus
        />
      ) : (
        <span className={`${styles.todoTitle} ${todo.completed ? styles.todoTitleCompleted : ''}`}>
          {todo.title}
        </span>
      )}

      <div className={styles.todoActions}>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className={`${styles.button} ${styles.buttonSuccess}`}
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.button}
            >
              ✏️ עריכה
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className={`${styles.button} ${styles.buttonDanger}`}
            >
              🗑️ מחק
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;