import React from 'react';
import { TodoItem } from '../index';
import styles from './TodoList.module.css';

const TodoList = ({ 
  todos, 
  totalCount, 
  searchTerm, 
  filterStatus, 
  onToggle, 
  onUpdate, 
  onDelete 
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        רשימת המשימות ({todos.length} מתוך {totalCount})
      </h3>

      {todos.length === 0 ? (
        <div className={styles.empty}>
          {searchTerm || filterStatus !== 'all' 
            ? '🔍 לא נמצאו משימות התואמות לחיפוש'
            : '📝 עדיין אין משימות. הוסף משימה ראשונה!'}
        </div>
      ) : (
        <div className={styles.todoList}>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;