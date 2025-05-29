import React from 'react';
import styles from './TodoAddForm.module.css';

const TodoAddForm = ({ 
  showAddForm, 
  newTodo, 
  setNewTodo, 
  onAdd, 
  onToggleForm 
}) => {
  const handleAdd = () => {
    onAdd();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>ניהול משימות</h2>
        <button 
          onClick={onToggleForm}
          className={`${styles.button} ${showAddForm ? styles.buttonSecondary : styles.buttonSuccess}`}
        >
          {showAddForm ? 'ביטול' : '+ הוסף משימה'}
        </button>
      </div>

      {showAddForm && (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="הכנס משימה חדשה..."
            className={styles.addInput}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button 
            onClick={handleAdd}
            disabled={!newTodo.trim()}
            className={`${styles.button} ${styles.buttonSuccess}`}
          >
            הוסף
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoAddForm;