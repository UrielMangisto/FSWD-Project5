/* filepath: src/components/PhotoModal/PhotoModal.jsx */
import React from 'react';
import styles from './PhotoModal.module.css';

const PhotoModal = ({ photo, onClose, onDelete }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{photo.title}</h3>
          <button 
            onClick={onClose}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.imageContainer}>
          <img
            src={photo.url}
            alt={photo.title}
            className={styles.image}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400/cccccc/666666?text=Image+Not+Found';
            }}
          />
        </div>
        
        <div className={styles.info}>
          <p className={styles.photoId}>תמונה #{photo.id}</p>
          <div className={styles.actions}>
            <button
              onClick={onDelete}
              className={`${styles.button} ${styles.buttonDanger}`}
            >
              🗑 מחק תמונה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;