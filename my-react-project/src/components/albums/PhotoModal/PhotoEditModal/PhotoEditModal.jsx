import React, { useState } from 'react';
import styles from './PhotoEditModal.module.css';

const PhotoEditModal = ({ photo, onSave, onClose }) => {
  const [editData, setEditData] = useState({
    title: photo.title,
    url: photo.url,
    thumbnailUrl: photo.thumbnailUrl || photo.url
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editData.title.trim() || !editData.url.trim()) {
      alert('יש למלא כותרת וקישור לתמונה');
      return;
    }

    setSaving(true);
    try {
      await onSave(photo.id, editData);
      onClose();
    } catch (error) {
      alert('שגיאה בשמירת התמונה');
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>ערוך תמונה #{photo.id}</h3>
          <button 
            onClick={onClose}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.field}>
            <label className={styles.label}>כותרת התמונה:</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className={styles.input}
              placeholder="הכנס כותרת לתמונה..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>קישור לתמונה:</label>
            <input
              type="url"
              value={editData.url}
              onChange={(e) => setEditData({...editData, url: e.target.value})}
              className={styles.input}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>קישור לתמונה קטנה (אופציונלי):</label>
            <input
              type="url"
              value={editData.thumbnailUrl}
              onChange={(e) => setEditData({...editData, thumbnailUrl: e.target.value})}
              className={styles.input}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          {editData.url && (
            <div className={styles.preview}>
              <label className={styles.label}>תצוגה מקדימה:</label>
              <img
                src={editData.thumbnailUrl || editData.url}
                alt="תצוגה מקדימה"
                className={styles.previewImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x150/cccccc/666666?text=No+Image';
                }}
              />
            </div>
          )}
        </div>
        
        <div className={styles.actions}>
          <button
            onClick={handleSave}
            disabled={saving || !editData.title.trim() || !editData.url.trim()}
            className={`${styles.button} ${styles.buttonSuccess}`}
          >
            {saving ? '⏳ שומר...' : '✓ שמור שינויים'}
          </button>
          <button
            onClick={onClose}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditModal;