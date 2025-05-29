import React from 'react';
import styles from './TodoControls.module.css';

const TodoControls = ({ 
  sortBy, 
  setSortBy, 
  filterStatus, 
  setFilterStatus, 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className={styles.controls}>
      <select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
        className={styles.select}
      >
        <option value="id">מיון לפי מזהה</option>
        <option value="title">מיון לפי כותרת</option>
        <option value="completed">מיון לפי מצב</option>
      </select>

      <select 
        value={filterStatus} 
        onChange={(e) => setFilterStatus(e.target.value)}
        className={styles.select}
      >
        <option value="all">כל המשימות</option>
        <option value="completed">הושלמו</option>
        <option value="pending">בהמתנה</option>
      </select>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="חיפוש לפי מזהה או כותרת..."
        className={styles.input}
      />
    </div>
  );
};

export default TodoControls;