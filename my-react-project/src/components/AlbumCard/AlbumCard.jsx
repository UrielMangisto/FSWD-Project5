/* filepath: src/components/AlbumCard/AlbumCard.jsx */
import React, { useState } from 'react';
import styles from './AlbumCard.module.css';

const AlbumCard = ({ album, isSelected, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(album.title);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== album.title) {
      onUpdate(album.id, editTitle);
    }
    setIsEditing(false);
    setEditTitle(album.title);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(album.title);
  };

  return (
    <div 
      className={`${styles.albumCard} ${isSelected ? styles.albumCardSelected : ''}`}
      onClick={() => !isEditing && onSelect(album)}
    >
      <div className={styles.albumHeader}>
        <span className={styles.albumId}>אלבום #{album.id}</span>
      </div>
      
      {isEditing ? (
        <div className={styles.editForm}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            className={styles.input}
            onClick={(e) => e.stopPropagation()}
            autoFocus
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
          <h4 className={styles.albumTitle}>{album.title}</h4>
          
          <div className={styles.albumActions}>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(album); }}
              className={styles.button}
            >
              👁 צפה באלבום
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className={`${styles.button} ${styles.buttonWarning}`}
            >
              ✏ ערוך
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(album.id); }}
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

export default AlbumCard;