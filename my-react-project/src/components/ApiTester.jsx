import { useState } from 'react';
import * as api from '../api/api.js';

function ApiTester() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (testName, success, data, error = null) => {
    const result = {
      id: Date.now(),
      testName,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [result, ...prev]);
  };

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      const result = await testFunction();
      addResult(testName, true, result);
    } catch (error) {
      addResult(testName, false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test functions
  const testGetUsers = () => {
    runTest('Get Users', () => api.getUsers());
  };

  const testGetUser = () => {
    runTest('Get User (ID: 1)', () => api.getUser(1));
  };

  const testLogin = () => {
    runTest('Login (Bret)', () => api.login('Bret', 'hildegard.org'));
  };

  const testLoginFail = () => {
    runTest('Login Fail', () => api.login('Bret', 'wrongpassword'));
  };

  const testGetTodos = () => {
    runTest('Get User Todos', () => api.getUserTodos(1));
  };

  const testCreateTodo = () => {
    runTest('Create Todo', () => api.createTodo({
      userId: 1,
      title: 'Test Todo from React',
      completed: false
    }));
  };

  const testGetPosts = () => {
    runTest('Get User Posts', () => api.getUserPosts(1));
  };

  const testGetAlbums = () => {
    runTest('Get User Albums', () => api.getUserAlbums(1));
  };

  const testGetPhotos = () => {
    runTest('Get Album Photos', () => api.getAlbumPhotos(1));
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 API Tester - בדיקת פונקציות API</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p>בדוק שהשרת רץ ב: <code>http://localhost:3001</code></p>
        <p>כל הפונקציות צריכות לעבוד לפני שנתחיל עם האתר</p>
      </div>

      {/* Test Buttons */}
      <div style={{ marginBottom: '30px' }}>
        <h2>בדיקות API:</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={testGetUsers}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Get Users
          </button>
          
          <button 
            onClick={testGetUser}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Get User (1)
          </button>
          
          <button 
            onClick={testLogin}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Login Success
          </button>
          
          <button 
            onClick={testLoginFail}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Login Fail
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={testGetTodos}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Get Todos
          </button>
          
          <button 
            onClick={testCreateTodo}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Create Todo
          </button>
          
          <button 
            onClick={testGetPosts}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Get Posts
          </button>
          
          <button 
            onClick={testGetAlbums}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Get Albums
          </button>
          
          <button 
            onClick={testGetPhotos}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Get Photos
          </button>
        </div>

        <button 
          onClick={clearResults}
          style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Clear Results
        </button>
      </div>

      {loading && (
        <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', marginBottom: '20px' }}>
          ⏳ Running test...
        </div>
      )}

      {/* Results */}
      <div>
        <h2>תוצאות הבדיקות:</h2>
        {results.length === 0 ? (
          <p style={{ color: '#666' }}>לא בוצעו בדיקות עדיין. לחץ על כפתור בדיקה כדי להתחיל.</p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {results.map(result => (
              <div 
                key={result.id}
                style={{
                  padding: '15px',
                  margin: '10px 0',
                  backgroundColor: result.success ? '#d4edda' : '#f8d7da',
                  border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                  borderRadius: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: result.success ? '#155724' : '#721c24' }}>
                    {result.success ? '✅' : '❌'} {result.testName}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {result.timestamp}
                  </span>
                </div>
                
                {result.success ? (
                  <details>
                    <summary style={{ cursor: 'pointer', color: '#007bff' }}>
                      View Data ({Array.isArray(result.data) ? result.data.length : 'object'})
                    </summary>
                    <pre style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                ) : (
                  <p style={{ margin: 0, color: '#721c24' }}>
                    Error: {result.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h3>הוראות:</h3>
        <ol>
          <li>ודא שהשרת רץ: <code>npm run server</code></li>
          <li>בדוק שהוא זמין ב: <a href="http://localhost:3001/users" target="_blank">http://localhost:3001/users</a></li>
          <li>הרץ את כל הבדיקות לפני שתמשיך עם האתר</li>
          <li>אם יש שגיאות - בדוק את הקונסול של הדפדפן</li>
        </ol>
      </div>
    </div>
  );
}

export default ApiTester;