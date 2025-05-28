import React, { useState, useEffect } from 'react';
import styles from './PostsPage.module.css';
import Header from '../../components/Header/Header';
import PostCard from '../../components/PostCard/PostCard';
import SelectedPost from '../../components/SelectedPost/SelectedPost';
import { 
  getUserPosts, 
  createPost, 
  updatePost, 
  deletePost
} from '../../api/postsApi';
import { 
  getPostComments,
  createComment,
  updateComment,
  deleteComment
} from '../../api/commentsApi';
import { validateUserInfo } from '../../utils/navigationUtils';

const PostsPage = ({ currentUser, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentsCount, setCommentsCount] = useState({}); // הוספה חדשה
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchById, setSearchById] = useState('');
  const [searchByTitle, setSearchByTitle] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

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

  // שליפת הפוסטים מהשרת
  useEffect(() => {
    loadPosts();
  }, [currentUser.id]);
 
  // חיפוש וסינון
  useEffect(() => {
    const filtered = posts.filter(post => {
      const matchesId = searchById ? post.id.toString().includes(searchById) : true;
      const matchesTitle = searchByTitle ? post.title.toLowerCase().includes(searchByTitle.toLowerCase()) : true;
      return matchesId && matchesTitle;
    });
    setFilteredPosts(filtered);
  }, [posts, searchById, searchByTitle]);

  // טעינת כמות התגובות לכל הפוסטים מראש
  const loadCommentsCount = async (postsData) => {
    const counts = {};
    await Promise.all(
      postsData.map(async (post) => {
        try {
          const commentsData = await getPostComments(post.id);
          counts[post.id] = commentsData.length;
        } catch (error) {
          console.error(`Error loading comments count for post ${post.id}:`, error);
          counts[post.id] = 0;
        }
      })
    );
    setCommentsCount(counts);
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getUserPosts(currentUser.id);
      setPosts(postsData);
      // טעינת כמות התגובות מראש
      await loadCommentsCount(postsData);
      setError('');
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('שגיאה בטעינת הפוסטים');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      setError('יש למלא כותרת ותוכן לפוסט');
      return;
    }

    try {
      const postData = {
        userId: currentUser.id,
        title: newPost.title.trim(),
        body: newPost.body.trim()
      };
      
      const createdPost = await createPost(postData);
      setPosts([createdPost, ...posts]);
      // הוספת ספירת תגובות 0 לפוסט החדש
      setCommentsCount(prev => ({ ...prev, [createdPost.id]: 0 }));
      setNewPost({ title: '', body: '' });
      setShowAddForm(false);
      setError('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('שגיאה בהוספת הפוסט');
    }
  };

  const handleUpdatePost = async (id, updates) => {
    try {
      const fullUpdates = {
        ...updates,
        userId: currentUser.id
      };
      
      const updatedPost = await updatePost(id, fullUpdates);
      setPosts(posts.map(post => 
        post.id === id ? updatedPost : post
      ));
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(updatedPost);
      }
      setError('');
    } catch (err) {
      console.error('Error updating post:', err);
      setError('שגיאה בעדכון הפוסט');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) return;

    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
      }
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[id];
        return newComments;
      });
      setCommentsCount(prev => {
        const newCounts = { ...prev };
        delete newCounts[id];
        return newCounts;
      });
      setError('');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('שגיאה במחיקת הפוסט');
    }
  };

  const loadComments = async (postId) => {
    if (comments[postId]) return;

    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      const commentsData = await getPostComments(postId);
      setComments(prev => ({ ...prev, [postId]: commentsData }));
      // עדכון ספירה במקרה שהתווספו תגובות חדשות
      setCommentsCount(prev => ({ ...prev, [postId]: commentsData.length }));
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('שגיאה בטעינת התגובות');
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const commentData = {
        postId: postId,
        name: currentUser.name,
        email: currentUser.email,
        body: newComment.trim()
      };

      const createdComment = await createComment(commentData);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), createdComment]
      }));
      // עדכון ספירת תגובות
      setCommentsCount(prev => ({ 
        ...prev, 
        [postId]: (prev[postId] || 0) + 1 
      }));
      setNewComment('');
      setError('');
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('שגיאה בהוספת התגובה');
    }
  };

  const handleUpdateComment = async (postId, commentId) => {
    try {
      const commentData = {
        postId: postId,
        name: currentUser.name,
        email: currentUser.email,
        body: editedCommentText
      };

      const updatedComment = await updateComment(commentId, commentData);
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].map(c => c.id === commentId ? updatedComment : c)
      }));
      setEditingComment(null);
      setEditedCommentText('');
      setError('');
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('שגיאה בעדכון התגובה');
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את התגובה?')) return;

    try {
      await deleteComment(commentId);
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(comment => comment.id !== commentId)
      }));
      // עדכון ספירת תגובות
      setCommentsCount(prev => ({ 
        ...prev, 
        [postId]: Math.max((prev[postId] || 1) - 1, 0) 
      }));
      setError('');
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('שגיאה במחיקת התגובה');
    }
  };

  const selectPost = (post) => {
    setSelectedPost(post);
    if (!showComments[post.id]) {
      setShowComments(prev => ({ ...prev, [post.id]: false }));
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    if (!comments[postId]) {
      loadComments(postId);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header user={currentUser} onLogout={onLogout} title="הפוסטים שלי" />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.loading}>
              ⏳ טוען פוסטים...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header user={currentUser} onLogout={onLogout} title="הפוסטים שלי" />

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

        <div className={`${styles.grid} ${selectedPost ? styles.gridTwoColumns : ''}`}>
          {/* עמודה שמאלית - רשימת פוסטים */}
          <div className={selectedPost ? styles.scrollableColumn : ''}>
            <div className={styles.card}>
              <div className={styles.header}>
                <h2 className={styles.title}>הפוסטים שלי ({posts.length})</h2>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`${styles.button} ${showAddForm ? styles.buttonSecondary : styles.buttonSuccess}`}
                >
                  {showAddForm ? 'ביטול' : '+ פוסט חדש'}
                </button>
              </div>

              {showAddForm && (
                <div className={styles.addForm}>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="כותרת הפוסט..."
                    className={styles.input}
                  />
                  <textarea
                    value={newPost.body}
                    onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                    placeholder="תוכן הפוסט..."
                    className={styles.textarea}
                  />
                  <button 
                    onClick={handleAddPost}
                    disabled={!newPost.title.trim() || !newPost.body.trim()}
                    className={`${styles.button} ${styles.buttonSuccess}`}
                  >
                    פרסם פוסט
                  </button>
                </div>
              )}

              <div className={styles.controls}>
                <input
                  type="text"
                  value={searchById}
                  onChange={(e) => setSearchById(e.target.value)}
                  placeholder="חיפוש לפי מזהה..."
                  className={styles.input}
                />
                <input
                  type="text"
                  value={searchByTitle}
                  onChange={(e) => setSearchByTitle(e.target.value)}
                  placeholder="חיפוש לפי כותרת..."
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.title}>
                רשימת הפוסטים ({filteredPosts.length})
              </h3>

              {filteredPosts.length === 0 ? (
                <div className={styles.empty}>
                  {(searchById || searchByTitle)
                    ? '🔍 לא נמצאו פוסטים התואמים לחיפוש'
                    : '📝 עדיין אין פוסטים. צור פוסט ראשון!'}
                </div>
              ) : (
                <div className={styles.postsList}>
                  {filteredPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isSelected={selectedPost?.id === post.id}
                      onSelect={selectPost}
                      onUpdate={handleUpdatePost}
                      onDelete={handleDeletePost}
                      user={currentUser}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* עמודה ימנית - פוסט נבחר */}
          {selectedPost && (
            <div className={styles.selectedPostColumn}>
              <SelectedPost
                post={selectedPost}
                comments={comments[selectedPost.id] || []}
                commentsCount={commentsCount[selectedPost.id] || 0} // הוספת prop חדש
                loadingComments={loadingComments[selectedPost.id]}
                showComments={showComments[selectedPost.id]}
                onToggleComments={toggleComments}
                onAddComment={handleAddComment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
                newComment={newComment}
                setNewComment={setNewComment}
                editingComment={editingComment}
                setEditingComment={setEditingComment}
                editedCommentText={editedCommentText}
                setEditedCommentText={setEditedCommentText}
                onClose={() => setSelectedPost(null)}
                user={currentUser}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostsPage;