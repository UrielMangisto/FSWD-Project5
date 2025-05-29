import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/layout/Header'; // שינוי!
import styles from './TodosPage.module.css';
import { TodoItem } from '../../components/todos';
import { 
  getUserTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo,
  toggleTodoCompleted
} from '../../api/todosApi';
import { validateUserInfo } from '../../utils/navigationUtils';

const TodosPage = ({ currentUser, onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTodo, setNewTodo] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!validateUserInfo(currentUser)) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div style={{ textAlign: 'center', color: 'white', fontSize: '1.5rem' }}>
            שגיאה בטעינת נתוני המשתמש
          </div>
        </div>
      </div>
    );
  }

  // שליפת המשימות מהשרת
  useEffect(() => {
    loadTodos();
  }, [currentUser.id]);

  // סינון וחיפוש
  useEffect(() => {
    let filtered = todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           todo.id.toString().includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && todo.completed) ||
                           (filterStatus === 'pending' && !todo.completed);
      return matchesSearch && matchesStatus;
    });

    // מיון
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'id':
          return a.id - b.id;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'completed':
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        default:
          return 0;
      }
    });

    setFilteredTodos(filtered);
  }, [todos, searchTerm, filterStatus, sortBy]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const todosData = await getUserTodos(currentUser.id);
      setTodos(todosData);
      setError('');
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('שגיאה בטעינת המשימות');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const todoData = {
        userId: currentUser.id,
        title: newTodo.trim(),
        completed: false
      };

      const createdTodo = await createTodo(todoData);
      setTodos([...todos, createdTodo]);
      setNewTodo('');
      setShowAddForm(false);
      setError('');
    } catch (err) {
      console.error('Error creating todo:', err);
      setError('שגיאה בהוספת המשימה');
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const fullUpdates = {
        ...updates,
        userId: currentUser.id
      };

      const updatedTodo = await updateTodo(id, fullUpdates);
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setError('');
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('שגיאה בעדכון המשימה');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) return;

    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('שגיאה במחיקת המשימה');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await toggleTodoCompleted(id, !completed);
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
      setError('');
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError('שגיאה בעדכון סטטוס המשימה');
    }
  };

  const handleUpdateTitle = (id, title) => {
    if (title.trim()) {
      handleUpdateTodo(id, { title: title.trim(), completed: todos.find(t => t.id === id)?.completed });
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header user={currentUser} onLogout={onLogout} title="המשימות שלי" />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.loading}>
              ⏳ טוען משימות...
            </div>
          </div>
        </main>
      </div>
    );
  }

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className={styles.container}>
      <Header user={currentUser} onLogout={onLogout} title="המשימות שלי" />

      <main className={styles.main}>
        {error && (
          <div className={styles.error}>
            {error}
            <button 
              onClick={() => setError('')}
              className={styles.errorClose}
            >
              ✕
            </button>
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>סטטיסטיקות</h2>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>{totalTodos}</div>
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

        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>ניהול משימות</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
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
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <button 
                onClick={handleAddTodo}
                disabled={!newTodo.trim()}
                className={`${styles.button} ${styles.buttonSuccess}`}
              >
                הוסף
              </button>
            </div>
          )}

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
        </div>

        <div className={styles.card}>
          <h3 className={styles.title}>
            רשימת המשימות ({filteredTodos.length} מתוך {totalTodos})
          </h3>

          {filteredTodos.length === 0 ? (
            <div className={styles.empty}>
              {searchTerm || filterStatus !== 'all' 
                ? '🔍 לא נמצאו משימות התואמות לחיפוש'
                : '📝 עדיין אין משימות. הוסף משימה ראשונה!'}
            </div>
          ) : (
            <div className={styles.todoList}>
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleComplete}
                  onUpdate={handleUpdateTitle}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TodosPage;