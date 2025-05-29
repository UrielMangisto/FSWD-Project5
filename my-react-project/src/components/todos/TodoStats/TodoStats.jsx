import React from 'react';
import styles from './TodoStats.module.css';

const TodoStats = ({ totalTodos, completedTodos, pendingTodos }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>סטטיסטיקות</h2>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={`${styles.statNumber} ${styles.statTotal}`}>{totalTodos}</div>
          <div className={styles.statLabel}>סה"כ משימות</div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statNumber} ${styles.statCompleted}`}>{completedTodos}</div>
          <div className={styles.statLabel}>הושלמו</div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statNumber} ${styles.statPending}`}>{pendingTodos}</div>
          <div className={styles.statLabel}>בהמתנה</div>
        </div>
      </div>
    </div>
  );
};

export default TodoStats;