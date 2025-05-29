/* filepath: src/components/SelectedAlbum/SelectedAlbum.jsx */
import React, { useState } from 'react';
import styles from './SelectedAlbum.module.css';
import PhotoEditModal from '../PhotoModal/PhotoEditModal/PhotoEditModal';
import PhotoSlider from '../PhotoSlider/PhotoSlider';
import { updatePhoto } from '../../../api/photosApi';

const SelectedAlbum = ({ 
  album, 
  photos, 
  visibleCount, 
  loadingPhotos, 
  onLoadMore, 
  onAddPhoto, 
  onDeletePhoto, 
  onClose, 
  user 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: '', url: '', thumbnailUrl: '' });
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'slider'
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleAddPhoto = () => {
    if (!newPhoto.title.trim() || !newPhoto.url.trim()) {
      alert('יש למלא כותרת וקישור לתמונה');
      return;
    }

    const photoData = {
      ...newPhoto,
      thumbnailUrl: newPhoto.thumbnailUrl || newPhoto.url
    };

    onAddPhoto(album.id, photoData);
    setNewPhoto({ title: '', url: '', thumbnailUrl: '' });
    setShowAddForm(false);
  };

  const handleEditPhoto = async (photoId, editData) => {
    try {
      await updatePhoto(photoId, editData);
      // רענון הדף (פתרון זמני)
      window.location.reload();
    } catch (error) {
      console.error('Error updating photo:', error);
      throw error;
    }
  };

  const openPhotoInSlider = (photoIndex) => {
    setSelectedPhotoIndex(photoIndex);
    setViewMode('slider');
  };

  const visiblePhotos = photos.slice(0, visibleCount);
  const hasMorePhotos = photos.length > visibleCount;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{album.title}</h3>
          <p className={styles.subtitle}>אלבום #{album.id} • {photos.length} תמונות</p>
        </div>
        <button 
          onClick={onClose}
          className={`${styles.button} ${styles.buttonSecondary} ${styles.closeButton}`}
          title="סגור אלבום"
        >
          ✕
        </button>
      </div>

      <div className={styles.actions}>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`${styles.button} ${showAddForm ? styles.buttonSecondary : styles.buttonSuccess}`}
        >
          {showAddForm ? 'ביטול' : '+ הוסף תמונה'}
        </button>

        {photos.length > 0 && (
          <div className={styles.viewControls}>
            <button 
              onClick={() => setViewMode('grid')}
              className={`${styles.button} ${viewMode === 'grid' ? styles.buttonActive : ''}`}
            >
              📱 רשת
            </button>
            <button 
              onClick={() => setViewMode('slider')}
              className={`${styles.button} ${viewMode === 'slider' ? styles.buttonActive : ''}`}
            >
              🎠 סליידר
            </button>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newPhoto.title}
            onChange={(e) => setNewPhoto({...newPhoto, title: e.target.value})}
            placeholder="כותרת התמונה..."
            className={styles.input}
          />
          <input
            type="url"
            value={newPhoto.url}
            onChange={(e) => setNewPhoto({...newPhoto, url: e.target.value})}
            placeholder="קישור לתמונה (URL)..."
            className={styles.input}
          />
          <input
            type="url"
            value={newPhoto.thumbnailUrl}
            onChange={(e) => setNewPhoto({...newPhoto, thumbnailUrl: e.target.value})}
            placeholder="קישור לתמונה קטנה (אופציונלי)..."
            className={styles.input}
          />
          <button 
            onClick={handleAddPhoto}
            disabled={!newPhoto.title.trim() || !newPhoto.url.trim()}
            className={`${styles.button} ${styles.buttonSuccess}`}
          >
            הוסף תמונה
          </button>
        </div>
      )}

      {loadingPhotos ? (
        <div className={styles.loading}>
          ⏳ טוען תמונות...
        </div>
      ) : photos.length === 0 ? (
        <div className={styles.empty}>
          📸 עדיין אין תמונות באלבום זה
        </div>
      ) : (
        <>
          {viewMode === 'slider' ? (
            <PhotoSlider
              photos={photos}
              initialIndex={selectedPhotoIndex}
              onEdit={setEditingPhoto}
              onDelete={(photoId) => onDeletePhoto(photoId, album.id)}
            />
          ) : (
            <>
              <div className={styles.photosGrid}>
                {visiblePhotos.map((photo, index) => (
                  <div key={photo.id} className={styles.photoCard}>
                    <img
                      src={photo.thumbnailUrl || photo.url}
                      alt={photo.title}
                      className={styles.photoImage}
                      onClick={() => openPhotoInSlider(index)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image';
                      }}
                    />
                    <div className={styles.photoInfo}>
                      <h5 className={styles.photoTitle}>{photo.title}</h5>
                      <p className={styles.photoId}>תמונה #{photo.id}</p>
                    </div>
                    <div className={styles.photoActions}>
                      <button
                        onClick={() => setEditingPhoto(photo)}
                        className={`${styles.button} ${styles.buttonWarning} ${styles.photoActionButton}`}
                        title="ערוך תמונה"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => onDeletePhoto(photo.id, album.id)}
                        className={`${styles.button} ${styles.buttonDanger} ${styles.photoActionButton}`}
                        title="מחק תמונה"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {hasMorePhotos && (
                <div className={styles.loadMoreContainer}>
                  <button 
                    onClick={() => onLoadMore(album.id)}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                  >
                    טען עוד תמונות ({photos.length - visibleCount} נותרו)
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {editingPhoto && (
        <PhotoEditModal
          photo={editingPhoto}
          onSave={handleEditPhoto}
          onClose={() => setEditingPhoto(null)}
        />
      )}
    </div>
  );
};

export default SelectedAlbum;