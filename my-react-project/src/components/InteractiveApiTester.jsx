import { useState } from 'react';
//import * as api from '../api/api.js';
import * as api from '../api'; // Import all API functions


function InteractiveApiTester() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [todoForm, setTodoForm] = useState({
    userId: 1,
    title: '',
    completed: false
  });
  
  const [editTodoForm, setEditTodoForm] = useState({
    id: '',
    userId: 1,
    title: '',
    completed: false
  });
  
  const [postForm, setPostForm] = useState({
    userId: 1,
    title: '',
    body: ''
  });
  
  const [commentForm, setCommentForm] = useState({
    postId: 1,
    name: '',
    email: '',
    body: ''
  });
  
  const [albumForm, setAlbumForm] = useState({
    userId: 1,
    title: ''
  });
  
  const [photoForm, setPhotoForm] = useState({
    albumId: 1,
    title: '',
    url: '',
    thumbnailUrl: ''
  });

  // סטייטים חדשים
  const [editPostForm, setEditPostForm] = useState({
    id: '',
    userId: 1,
    title: '',
    body: ''
  });
  const [editCommentForm, setEditCommentForm] = useState({
    id: '',
    postId: 1,
    name: '',
    email: '',
    body: ''
  });
  const [editUserForm, setEditUserForm] = useState({
    id: '',
    name: '',
    username: '',
    email: ''
  });

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

  // Basic Tests
  const testGetUsers = () => runTest('Get Users', () => api.getUsers());
  const testGetUser = () => runTest('Get User (ID: 1)', () => api.getUser(1));
  const testLogin = () => runTest('Login (Bret)', () => api.login('Bret', 'hildegard.org'));
  const testLoginFail = () => runTest('Login Fail', () => api.login('Bret', 'wrongpassword'));
  const testGetTodos = () => runTest('Get User Todos', () => api.getUserTodos(1));
  const testGetPosts = () => runTest('Get User Posts', () => api.getUserPosts(1));
  const testGetAlbums = () => runTest('Get User Albums', () => api.getUserAlbums(1));
  const testGetPhotos = () => runTest('Get Album Photos', () => api.getAlbumPhotos(1));
  const testGetComments = () => runTest('Get Post Comments', () => api.getPostComments(1));

  // Interactive Handlers
  const handleCreateTodo = () => {
    if (!todoForm.title.trim()) {
      alert('נא למלא כותרת למשימה');
      return;
    }
    runTest('Create Todo', () => api.createTodo(todoForm));
    setTodoForm({ userId: 1, title: '', completed: false });
  };

  const handleUpdateTodo = () => {
    if (!editTodoForm.id || !editTodoForm.title.trim()) {
      alert('נא למלא מספר משימה וכותרת');
      return;
    }
    runTest('Update Todo', () => api.updateTodo(editTodoForm.id, {
      userId: editTodoForm.userId,
      title: editTodoForm.title,
      completed: editTodoForm.completed
    }));
    setEditTodoForm({ id: '', userId: 1, title: '', completed: false });
  };

  const handleDeleteTodo = () => {
    const todoId = prompt('מספר המשימה למחיקה:');
    if (!todoId) return;
    runTest('Delete Todo', () => api.deleteTodo(parseInt(todoId)));
  };

  const handleCreatePost = () => {
    if (!postForm.title.trim() || !postForm.body.trim()) {
      alert('נא למלא כותרת ותוכן לפוסט');
      return;
    }
    runTest('Create Post', () => api.createPost(postForm));
    setPostForm({ userId: 1, title: '', body: '' });
  };

  const handleCreateComment = () => {
    if (!commentForm.name.trim() || !commentForm.body.trim()) {
      alert('נא למלא שם ותוכן לתגובה');
      return;
    }
    runTest('Create Comment', () => api.createComment(commentForm));
    setCommentForm({ postId: 1, name: '', email: '', body: '' });
  };

  const handleCreateAlbum = () => {
    if (!albumForm.title.trim()) {
      alert('נא למלא כותרת לאלבום');
      return;
    }
    runTest('Create Album', () => api.createAlbum(albumForm));
    setAlbumForm({ userId: 1, title: '' });
  };

  const handleCreatePhoto = () => {
    if (!photoForm.title.trim() || !photoForm.url.trim()) {
      alert('נא למלא כותרת וקישור לתמונה');
      return;
    }
    runTest('Create Photo', () => api.createPhoto(photoForm));
    setPhotoForm({ albumId: 1, title: '', url: '', thumbnailUrl: '' });
  };

  // פונקציות שליחה
  const handleUpdatePost = () => {
    if (!editPostForm.id || !editPostForm.title.trim() || !editPostForm.body.trim()) {
      alert('נא למלא מספר פוסט, כותרת ותוכן');
      return;
    }
    runTest('Update Post', () => api.updatePost(editPostForm.id, {
      userId: editPostForm.userId,
      title: editPostForm.title,
      body: editPostForm.body
    }));
    setEditPostForm({ id: '', userId: 1, title: '', body: '' });
  };

  const handleUpdateComment = () => {
    if (!editCommentForm.id || !editCommentForm.name.trim() || !editCommentForm.body.trim()) {
      alert('נא למלא מספר תגובה, שם ותוכן');
      return;
    }
    runTest('Update Comment', () => api.updateComment(editCommentForm.id, {
      postId: editCommentForm.postId,
      name: editCommentForm.name,
      email: editCommentForm.email,
      body: editCommentForm.body
    }));
    setEditCommentForm({ id: '', postId: 1, name: '', email: '', body: '' });
  };

  const handleUpdateUser = () => {
    if (!editUserForm.id || !editUserForm.name.trim() || !editUserForm.username.trim()) {
      alert('נא למלא מספר משתמש, שם ושם משתמש');
      return;
    }
    runTest('Update User', () => api.updateUser(editUserForm.id, {
      name: editUserForm.name,
      username: editUserForm.username,
      email: editUserForm.email
    }));
    setEditUserForm({ id: '', name: '', username: '', email: '' });
  };

  const clearResults = () => setResults([]);

  // Styles
  const formStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const sectionStyle = {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px'
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 מרכז בדיקות API אינטראקטיבי</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Left Column - Tests and Forms */}
        <div>
          {/* Basic Tests */}
          <div style={sectionStyle}>
            <h2>🔍 בדיקות קריאה בסיסיות</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button onClick={testGetUsers} disabled={loading} style={buttonStyle}>Users</button>
              <button onClick={testGetUser} disabled={loading} style={buttonStyle}>User(1)</button>
              <button onClick={testLogin} disabled={loading} style={{ ...buttonStyle, backgroundColor: '#28a745' }}>Login✓</button>
              <button onClick={testLoginFail} disabled={loading} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>Login✗</button>
              <button onClick={testGetTodos} disabled={loading} style={buttonStyle}>Todos</button>
              <button onClick={testGetPosts} disabled={loading} style={buttonStyle}>Posts</button>
              <button onClick={testGetComments} disabled={loading} style={buttonStyle}>Comments</button>
              <button onClick={testGetAlbums} disabled={loading} style={buttonStyle}>Albums</button>
              <button onClick={testGetPhotos} disabled={loading} style={buttonStyle}>Photos</button>
            </div>
          </div>

          {/* Todo Form */}
          <div style={sectionStyle}>
            <h3>📋 יצירת משימה (Todo)</h3>
            <div style={formStyle}>
              <select 
                value={todoForm.userId} 
                onChange={(e) => setTodoForm({...todoForm, userId: parseInt(e.target.value)})}
                style={inputStyle}
              >
                <option value={1}>User 1 (Bret)</option>
                <option value={2}>User 2 (Antonette)</option>
                <option value={3}>User 3 (Samantha)</option>
              </select>
              
              <input
                type="text"
                placeholder="כותרת המשימה..."
                value={todoForm.title}
                onChange={(e) => setTodoForm({...todoForm, title: e.target.value})}
                style={inputStyle}
              />
              
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={todoForm.completed}
                  onChange={(e) => setTodoForm({...todoForm, completed: e.target.checked})}
                  style={{ marginRight: '8px' }}
                />
                המשימה הושלמה
              </label>
              
              <button onClick={handleCreateTodo} disabled={loading} style={buttonStyle}>
                צור משימה
              </button>
            </div>
          </div>

          {/* Edit Todo Form */}
          <div style={sectionStyle}>
            <h3>✏️ עריכת משימה (Todo)</h3>
            <div style={formStyle}>
              <input
                type="number"
                placeholder="מספר המשימה לעריכה (201, 202...)"
                value={editTodoForm.id}
                onChange={(e) => setEditTodoForm({...editTodoForm, id: e.target.value})}
                style={inputStyle}
              />
              
              <select 
                value={editTodoForm.userId} 
                onChange={(e) => setEditTodoForm({...editTodoForm, userId: parseInt(e.target.value)})}
                style={inputStyle}
              >
                <option value={1}>User 1 (Bret)</option>
                <option value={2}>User 2 (Antonette)</option>
                <option value={3}>User 3 (Samantha)</option>
              </select>
              
              <input
                type="text"
                placeholder="כותרת מעודכנת..."
                value={editTodoForm.title}
                onChange={(e) => setEditTodoForm({...editTodoForm, title: e.target.value})}
                style={inputStyle}
              />
              
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={editTodoForm.completed}
                  onChange={(e) => setEditTodoForm({...editTodoForm, completed: e.target.checked})}
                  style={{ marginRight: '8px' }}
                />
                המשימה הושלמה
              </label>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleUpdateTodo} disabled={loading} style={buttonStyle}>
                  עדכן משימה
                </button>
                <button onClick={handleDeleteTodo} disabled={loading} style={{...buttonStyle, backgroundColor: '#dc3545'}}>
                  מחק משימה
                </button>
              </div>
            </div>
          </div>

          {/* Post Form */}
          <div style={sectionStyle}>
            <h3>📝 יצירת פוסט</h3>
            <div style={formStyle}>
              <select 
                value={postForm.userId} 
                onChange={(e) => setPostForm({...postForm, userId: parseInt(e.target.value)})}
                style={inputStyle}
              >
                <option value={1}>User 1 (Bret)</option>
                <option value={2}>User 2 (Antonette)</option>
                <option value={3}>User 3 (Samantha)</option>
              </select>
              
              <input
                type="text"
                placeholder="כותרת הפוסט..."
                value={postForm.title}
                onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                style={inputStyle}
              />
              
              <textarea
                placeholder="תוכן הפוסט..."
                value={postForm.body}
                onChange={(e) => setPostForm({...postForm, body: e.target.value})}
                style={{...inputStyle, height: '80px', resize: 'vertical'}}
              />
              
              <button onClick={handleCreatePost} disabled={loading} style={buttonStyle}>
                צור פוסט
              </button>
            </div>
          </div>

          {/* Edit Post Form */}
          <div style={sectionStyle}>
            <h3>✏️ עריכת פוסט</h3>
            <div style={formStyle}>
              <input
                type="number"
                placeholder="מספר הפוסט לעריכה (101, 102...)"
                value={editPostForm.id}
                onChange={(e) => setEditPostForm({...editPostForm, id: e.target.value})}
                style={inputStyle}
              />
              
              <select 
                value={editPostForm.userId} 
                onChange={(e) => setEditPostForm({...editPostForm, userId: parseInt(e.target.value)})}
                style={inputStyle}
              >
                <option value={1}>User 1 (Bret)</option>
                <option value={2}>User 2 (Antonette)</option>
                <option value={3}>User 3 (Samantha)</option>
              </select>
              
              <input
                type="text"
                placeholder="כותרת מעודכנת..."
                value={editPostForm.title}
                onChange={(e) => setEditPostForm({...editPostForm, title: e.target.value})}
                style={inputStyle}
              />
              
              <textarea
                placeholder="תוכן מעודכן לפוסט..."
                value={editPostForm.body}
                onChange={(e) => setEditPostForm({...editPostForm, body: e.target.value})}
                style={{...inputStyle, height: '80px', resize: 'vertical'}}
              />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleUpdatePost} disabled={loading} style={buttonStyle}>
                  עדכן פוסט
                </button>
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <div style={sectionStyle}>
            <h3>💬 יצירת תגובה</h3>
            <div style={formStyle}>
              <input
                type="number"
                placeholder="מספר פוסט (1, 2, 3...)"
                value={commentForm.postId}
                onChange={(e) => setCommentForm({...commentForm, postId: parseInt(e.target.value)})}
                style={inputStyle}
              />
              
              <input
                type="text"
                placeholder="שם המגיב..."
                value={commentForm.name}
                onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                style={inputStyle}
              />
              
              <input
                type="email"
                placeholder="אימייל (לא חובה)..."
                value={commentForm.email}
                onChange={(e) => setCommentForm({...commentForm, email: e.target.value})}
                style={inputStyle}
              />
              
              <textarea
                placeholder="תוכן התגובה..."
                value={commentForm.body}
                onChange={(e) => setCommentForm({...commentForm, body: e.target.value})}
                style={{...inputStyle, height: '60px', resize: 'vertical'}}
              />
              
              <button onClick={handleCreateComment} disabled={loading} style={buttonStyle}>
                צור תגובה
              </button>
            </div>
          </div>

          {/* Edit Comment Form */}
          <div style={sectionStyle}>
            <h3>✏️ עריכת תגובה</h3>
            <div style={formStyle}>
              <input
                type="number"
                placeholder="מספר תגובה לעריכה (301, 302...)"
                value={editCommentForm.id}
                onChange={(e) => setEditCommentForm({...editCommentForm, id: e.target.value})}
                style={inputStyle}
              />
              
              <input
                type="number"
                placeholder="מספר פוסט קשור (1, 2, 3...)"
                value={editCommentForm.postId}
                onChange={(e) => setEditCommentForm({...editCommentForm, postId: parseInt(e.target.value)})}
                style={inputStyle}
              />
              
              <input
                type="text"
                placeholder="שם המגיב מעודכן..."
                value={editCommentForm.name}
                onChange={(e) => setEditCommentForm({...editCommentForm, name: e.target.value})}
                style={inputStyle}
              />
              
              <input
                type="email"
                placeholder="אימייל מעודכן (לא חובה)..."
                value={editCommentForm.email}
                onChange={(e) => setEditCommentForm({...editCommentForm, email: e.target.value})}
                style={inputStyle}
              />
              
              <textarea
                placeholder="תוכן התגובה המעודכן..."
                value={editCommentForm.body}
                onChange={(e) => setEditCommentForm({...editCommentForm, body: e.target.value})}
                style={{...inputStyle, height: '60px', resize: 'vertical'}}
              />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleUpdateComment} disabled={loading} style={buttonStyle}>
                  עדכן תגובה
                </button>
              </div>
            </div>
          </div>

          {/* Album Form */}
          <div style={sectionStyle}>
            <h3>🖼️ יצירת אלבום</h3>
            <div style={formStyle}>
              <select 
                value={albumForm.userId} 
                onChange={(e) => setAlbumForm({...albumForm, userId: parseInt(e.target.value)})}
                style={inputStyle}
              >
                <option value={1}>User 1 (Bret)</option>
                <option value={2}>User 2 (Antonette)</option>
                <option value={3}>User 3 (Samantha)</option>
              </select>
              
              <input
                type="text"
                placeholder="שם האלבום..."
                value={albumForm.title}
                onChange={(e) => setAlbumForm({...albumForm, title: e.target.value})}
                style={inputStyle}
              />
              
              <button onClick={handleCreateAlbum} disabled={loading} style={buttonStyle}>
                צור אלבום
              </button>
            </div>
          </div>

          {/* Photo Form */}
          <div style={sectionStyle}>
            <h3>📷 יצירת תמונה</h3>
            <div style={formStyle}>
              <input
                type="number"
                placeholder="מספר אלבום (1, 2, 3...)"
                value={photoForm.albumId}
                onChange={(e) => setPhotoForm({...photoForm, albumId: parseInt(e.target.value)})}
                style={inputStyle}
              />
              
              <input
                type="text"
                placeholder="כותרת התמונה..."
                value={photoForm.title}
                onChange={(e) => setPhotoForm({...photoForm, title: e.target.value})}
                style={inputStyle}
              />
              
              <input
                type="url"
                placeholder="קישור לתמונה (https://picsum.photos/600/400)"
                value={photoForm.url}
                onChange={(e) => setPhotoForm({...photoForm, url: e.target.value})}
                style={inputStyle}
              />
              
              <input
                type="url"
                placeholder="קישור לתמונה מוקטנת (https://picsum.photos/150/100)"
                value={photoForm.thumbnailUrl}
                onChange={(e) => setPhotoForm({...photoForm, thumbnailUrl: e.target.value})}
                style={inputStyle}
              />
              
              <button onClick={handleCreatePhoto} disabled={loading} style={buttonStyle}>
                הוסף תמונה
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div>
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2>📊 תוצאות</h2>
              <button onClick={clearResults} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>
                נקה הכל
              </button>
            </div>

            {loading && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '4px', 
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                ⏳ מעבד בקשה...
              </div>
            )}

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {results.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                  לא בוצעו פעולות עדיין.<br/>
                  השתמש בכפתורים או בטפסים כדי לבדוק את ה-API.
                </p>
              ) : (
                results.map(result => (
                  <div 
                    key={result.id}
                    style={{
                      padding: '15px',
                      margin: '10px 0',
                      backgroundColor: result.success ? '#d4edda' : '#f8d7da',
                      border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, color: result.success ? '#155724' : '#721c24' }}>
                        {result.success ? '✅' : '❌'} {result.testName}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {result.timestamp}
                      </span>
                    </div>
                    
                    {result.success ? (
                      <details>
                        <summary style={{ cursor: 'pointer', color: '#007bff', marginBottom: '8px' }}>
                          📄 הצג נתונים ({Array.isArray(result.data) ? `${result.data.length} פריטים` : 'אובייקט'})
                        </summary>
                        <pre style={{ 
                          backgroundColor: '#f8f9fa', 
                          padding: '12px', 
                          borderRadius: '4px', 
                          fontSize: '11px',
                          overflow: 'auto',
                          maxHeight: '200px',
                          direction: 'ltr'
                        }}>
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      <p style={{ margin: 0, color: '#721c24' }}>
                        ❌ שגיאה: {result.error}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h3>💡 הוראות שימוש:</h3>
        <ul style={{ paddingRight: '20px' }}>
          <li>השתמש בכפתורי הקריאה כדי לבדוק שהנתונים נטענים כהלכה</li>
          <li>מלא את הטפסים כדי ליצור נתונים חדשים ולבדוק CRUD operations</li>
          <li>כל פעולה תופיע בחלון התוצאות בצד ימין</li>
          <li>ודא שהשרת רץ ב: <code>npm run server</code></li>
          <li>אם יש שגיאות - בדוק את הקונסול של הדפדפן</li>
        </ul>
      </div>
    </div>
  );
}

export default InteractiveApiTester;