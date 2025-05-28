import React, { useState } from 'react';
import styles from './PostCard.module.css';

const PostCard = ({ 
  post, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete, 
  user 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: post.title, body: post.body });

  const handleSave = () => {
    if (editData.title.trim() && editData.body.trim()) {
      onUpdate(post.id, editData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ title: post.title, body: post.body });
  };

  return (
    <div 
      className={`${styles.postCard} ${isSelected ? styles.postCardSelected : ''}`}
      onClick={() => !isEditing && onSelect(post)}
    >
      <div className={styles.postHeader}>
        <div className={styles.postId}>פוסט #{post.id}</div>
      </div>
      
      {isEditing ? (
        <div className={styles.editForm}>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            className={styles.input}
            onClick={(e) => e.stopPropagation()}
          />
          <textarea
            value={editData.body}
            onChange={(e) => setEditData({...editData, body: e.target.value})}
            className={styles.textarea}
            onClick={(e) => e.stopPropagation()}
          />
          <div className={styles.editActions}>
            <button
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className={`${styles.button} ${styles.buttonSuccess}`}
            >
              ✓ שמור
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCancel(); }}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              ✕ ביטול
            </button>
          </div>
        </div>
      ) : (
        <>
          <h4 className={styles.postTitle}>{post.title}</h4>
          <p className={styles.postBody}>
            {post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}
          </p>
          <div className={styles.postActions}>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(post); }}
              className={styles.button}
            >
              👁 בחר פוסט
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className={`${styles.button} ${styles.buttonWarning}`}
            >
              ✏ ערוך
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
              className={`${styles.button} ${styles.buttonDanger}`}
            >
              🗑 מחק
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;