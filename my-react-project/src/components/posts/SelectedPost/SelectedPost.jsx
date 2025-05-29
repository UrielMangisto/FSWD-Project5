import React from 'react';
import styles from './SelectedPost.module.css';

const SelectedPost = ({
  post,
  comments,
  commentsCount = 0, // prop חדש
  loadingComments,
  showComments,
  onToggleComments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  newComment,
  setNewComment,
  editingComment,
  setEditingComment,
  editedCommentText,
  setEditedCommentText,
  onClose,
  user
}) => {
  const handleAddComment = () => {
    onAddComment(post.id);
  };

  const handleUpdateComment = (commentId) => {
    onUpdateComment(post.id, commentId);
  };

  const handleDeleteComment = (commentId) => {
    onDeleteComment(commentId, post.id);
  };

  const startEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditedCommentText(comment.body);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditedCommentText('');
  };

  // בדיקה אם המשתמש יכול לערוך/למחוק תגובה
  const canEditComment = (comment) => {
    return comment.email === user.email || comment.name === user.name;
  };

  // שימוש במספר התגובות הנכון - commentsCount אם קיים, אחרת comments.length
  const displayCommentsCount = showComments ? comments.length : commentsCount;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{post.title}</h3>
          <p className={styles.subtitle}>פוסט #{post.id}</p>
        </div>
        <button 
          onClick={onClose}
          className={`${styles.button} ${styles.buttonSecondary} ${styles.closeButton}`}
          title="סגור פוסט"
        >
          ✕
        </button>
      </div>

      <div className={styles.content}>
        <p className={styles.body}>{post.body}</p>
      </div>

      <div className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <h4 className={styles.commentsTitle}>
            תגובות ({displayCommentsCount})
          </h4>
          <button
            onClick={() => onToggleComments(post.id)}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            {showComments ? 
              '🙈 הסתר תגובות' : 
              `👀 הצג תגובות (${displayCommentsCount})`
            }
          </button>
        </div>

        {showComments && (
          <>
            {/* טופס הוספת תגובה */}
            <div className={styles.addCommentForm}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="כתוב תגובה חדשה..."
                className={styles.textarea}
                rows="3"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`${styles.button} ${styles.buttonSuccess}`}
              >
                הוסף תגובה
              </button>
            </div>

            {/* רשימת תגובות */}
            {loadingComments ? (
              <div className={styles.loading}>
                ⏳ טוען תגובות...
              </div>
            ) : comments.length === 0 ? (
              <div className={styles.empty}>
                💬 עדיין אין תגובות לפוסט זה
              </div>
            ) : (
              <div className={styles.commentsList}>
                {comments.map(comment => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentInfo}>
                        <strong className={styles.commentAuthor}>
                          {comment.name}
                        </strong>
                        <span className={styles.commentId}>
                          תגובה #{comment.id}
                        </span>
                        {canEditComment(comment) && (
                          <span className={styles.ownComment}>
                            (התגובה שלך)
                          </span>
                        )}
                      </div>
                      {canEditComment(comment) && (
                        <div className={styles.commentActions}>
                          {editingComment === comment.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateComment(comment.id)}
                                className={`${styles.button} ${styles.buttonSuccess} ${styles.buttonSmall}`}
                              >
                                ✓
                              </button>
                              <button
                                onClick={cancelEditComment}
                                className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonSmall}`}
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditComment(comment)}
                                className={`${styles.button} ${styles.buttonWarning} ${styles.buttonSmall}`}
                              >
                                ✏
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className={`${styles.button} ${styles.buttonDanger} ${styles.buttonSmall}`}
                              >
                                🗑
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {editingComment === comment.id ? (
                      <textarea
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                        className={styles.editTextarea}
                        rows="3"
                      />
                    ) : (
                      <p className={styles.commentBody}>{comment.body}</p>
                    )}

                    <div className={styles.commentFooter}>
                      <span className={styles.commentEmail}>{comment.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SelectedPost;