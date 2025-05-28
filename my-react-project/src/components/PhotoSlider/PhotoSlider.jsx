import React, { useState, useEffect } from 'react';
import styles from './PhotoSlider.module.css';

const PhotoSlider = ({ photos, onEdit, onDelete, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToPhoto = (index) => {
    setCurrentIndex(index);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  useEffect(() => {
    if (isFullscreen) {
      // מניעת גלילה ברקע
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        // החזרת גלילה
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isFullscreen]);

  if (photos.length === 0) {
    return <div className={styles.empty}>אין תמונות להצגה</div>;
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className={`${styles.slider} ${isFullscreen ? styles.fullscreen : ''}`}>
      <div className={styles.imageContainer}>
        <button 
          onClick={prevPhoto}
          className={`${styles.navButton} ${styles.prevButton}`}
          disabled={photos.length <= 1}
        >
          ◀
        </button>
        
        <div className={styles.imageWrapper}>
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className={styles.image}
            onClick={() => setIsFullscreen(!isFullscreen)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400/cccccc/666666?text=Image+Not+Found';
            }}
          />
          
          <div className={styles.imageOverlay}>
            <h4 className={styles.imageTitle}>{currentPhoto.title}</h4>
            <div className={styles.imageActions}>
              <button
                onClick={() => onEdit(currentPhoto)}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                ✏ ערוך
              </button>
              <button
                onClick={() => onDelete(currentPhoto.id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                🗑 מחק
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`${styles.actionButton} ${styles.fullscreenButton}`}
              >
                {isFullscreen ? '🗗 יציאה' : '🔍 מסך מלא'}
              </button>
            </div>
          </div>
        </div>
        
        <button 
          onClick={nextPhoto}
          className={`${styles.navButton} ${styles.nextButton}`}
          disabled={photos.length <= 1}
        >
          ▶
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.counter}>
          {currentIndex + 1} / {photos.length}
        </div>
        
        <div className={styles.thumbnails}>
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => goToPhoto(index)}
              className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
            >
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={photo.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/60x60/cccccc/666666?text=?';
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className={styles.closeFullscreen}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default PhotoSlider;