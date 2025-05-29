import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { ErrorMessage } from '../../components/common';
import { 
  TodoStats, 
  TodoAddForm, 
  TodoControls, 
  TodoList 
} from '../../components/todos';
import { 
  getUserTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo,
  toggleTodoCompleted
} from '../../api/todosApi';
import { validateUserInfo } from '../../utils/navigationUtils';
import styles from './TodosPage.module.css';

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
        <ErrorMessage error={error} onClose={() => setError('')} />

        <TodoStats 
          totalTodos={totalTodos}
          completedTodos={completedTodos}
          pendingTodos={pendingTodos}
        />

        <TodoAddForm
          showAddForm={showAddForm}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          onAdd={handleAddTodo}
          onToggleForm={() => setShowAddForm(!showAddForm)}
        />

        <div className={styles.card}>
          <TodoControls
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <TodoList
            todos={filteredTodos}
            totalCount={totalTodos}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onToggle={handleToggleComplete}
            onUpdate={handleUpdateTitle}
            onDelete={handleDeleteTodo}
          />
        </div>
      </main>
    </div>
  );
};

export default TodosPage;