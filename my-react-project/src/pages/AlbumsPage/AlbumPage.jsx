import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/layout/Header'; // שינוי!
import styles from './AlbumsPage.module.css';
import AlbumCard from '../../components/AlbumCard/AlbumCard';
import SelectedAlbum from '../../components/SelectedAlbum/SelectedAlbum';
import { 
  getUserAlbums, 
  createAlbum, 
  updateAlbum, 
  deleteAlbum 
} from '../../api/albumsApi';
import { 
  getAlbumPhotos, 
  createPhoto, 
  deletePhoto 
} from '../../api/photosApi';
import { validateUserInfo } from '../../utils/navigationUtils';

const AlbumPage = ({ currentUser, onLogout }) => {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchById, setSearchById] = useState(''); // שדה חיפוש נפרד למזהה
  const [searchByTitle, setSearchByTitle] = useState(''); // שדה חיפוש נפרד לכותרת
  const [photos, setPhotos] = useState({});
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlbum, setNewAlbum] = useState('');
  const [loadingPhotos, setLoadingPhotos] = useState({});
  const [visiblePhotos, setVisiblePhotos] = useState({});
  const [photosPerLoad] = useState(6);

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

  // שליפת האלבומים מהשרת
  useEffect(() => {
    loadAlbums();
  }, [currentUser.id]);

  // חיפוש וסינון - עדכון לשני שדות חיפוש נפרדים
  useEffect(() => {
    const filtered = albums.filter(album => {
      const matchesId = searchById ? album.id.toString().includes(searchById) : true;
      const matchesTitle = searchByTitle ? album.title.toLowerCase().includes(searchByTitle.toLowerCase()) : true;
      return matchesId && matchesTitle;
    });
    setFilteredAlbums(filtered);
  }, [albums, searchById, searchByTitle]);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const albumsData = await getUserAlbums(currentUser.id);
      setAlbums(albumsData);
      setError('');
    } catch (err) {
      console.error('Error loading albums:', err);
      setError('שגיאה בטעינת האלבומים');
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async (albumId) => {
    if (photos[albumId]) return; // כבר נטען

    try {
      setLoadingPhotos(prev => ({ ...prev, [albumId]: true }));
      const photosData = await getAlbumPhotos(albumId);
      setPhotos(prev => ({ ...prev, [albumId]: photosData }));
      setVisiblePhotos(prev => ({ ...prev, [albumId]: photosPerLoad }));
    } catch (err) {
      console.error('Error loading photos:', err);
      setError('שגיאה בטעינת התמונות');
    } finally {
      setLoadingPhotos(prev => ({ ...prev, [albumId]: false }));
    }
  };

  const handleLoadMorePhotos = (albumId) => {
    setVisiblePhotos(prev => ({
      ...prev,
      [albumId]: (prev[albumId] || photosPerLoad) + photosPerLoad
    }));
  };

  const handleAddAlbum = async () => {
    if (!newAlbum.trim()) return;

    try {
      const albumData = {
        userId: currentUser.id,
        title: newAlbum.trim()
      };

      const createdAlbum = await createAlbum(albumData);
      setAlbums([createdAlbum, ...albums]);
      setNewAlbum('');
      setShowAddForm(false);
      setError('');
    } catch (err) {
      console.error('Error creating album:', err);
      setError('שגיאה בהוספת האלבום');
    }
  };

  const handleUpdateAlbum = async (id, title) => {
    try {
      const albumData = {
        title: title.trim(),
        userId: currentUser.id
      };

      const updatedAlbum = await updateAlbum(id, albumData);
      setAlbums(albums.map(album => 
        album.id === id ? updatedAlbum : album
      ));
      if (selectedAlbum && selectedAlbum.id === id) {
        setSelectedAlbum(updatedAlbum);
      }
      setError('');
    } catch (err) {
      console.error('Error updating album:', err);
      setError('שגיאה בעדכון האלבום');
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את האלבום? כל התמונות בו יימחקו גם כן.')) return;

    try {
      await deleteAlbum(id);
      setAlbums(albums.filter(album => album.id !== id));
      if (selectedAlbum && selectedAlbum.id === id) {
        setSelectedAlbum(null);
      }
      // מחיקת תמונות מהזיכרון
      setPhotos(prev => {
        const newPhotos = { ...prev };
        delete newPhotos[id];
        return newPhotos;
      });
      setVisiblePhotos(prev => {
        const newVisible = { ...prev };
        delete newVisible[id];
        return newVisible;
      });
      setError('');
    } catch (err) {
      console.error('Error deleting album:', err);
      setError('שגיאה במחיקת האלבום');
    }
  };

  const handleAddPhoto = async (albumId, photoData) => {
    try {
      const fullPhotoData = {
        albumId: albumId,
        title: photoData.title,
        url: photoData.url,
        thumbnailUrl: photoData.thumbnailUrl || photoData.url
      };

      const createdPhoto = await createPhoto(fullPhotoData);
      setPhotos(prev => ({
        ...prev,
        [albumId]: [...(prev[albumId] || []), createdPhoto]
      }));
      setError('');
    } catch (err) {
      console.error('Error creating photo:', err);
      setError('שגיאה בהוספת התמונה');
    }
  };

  const handleDeletePhoto = async (photoId, albumId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את התמונה?')) return;

    try {
      await deletePhoto(photoId);
      setPhotos(prev => ({
        ...prev,
        [albumId]: prev[albumId].filter(photo => photo.id !== photoId)
      }));
      setError('');
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('שגיאה במחיקת התמונה');
    }
  };

  const selectAlbum = (album) => {
    setSelectedAlbum(album);
    loadPhotos(album.id);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header user={currentUser} onLogout={onLogout} title="האלבומים שלי" />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.loading}>
              ⏳ טוען אלבומים...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header user={currentUser} onLogout={onLogout} title="האלבומים שלי" />

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

        <div className={`${styles.grid} ${selectedAlbum ? styles.gridTwoColumns : ''}`}>
          {/* עמודה שמאלית - רשימת אלבומים */}
          <div className={selectedAlbum ? styles.scrollableColumn : ''}>
            <div className={styles.card}>
              <div className={styles.header}>
                <h2 className={styles.title}>האלבומים שלי ({albums.length})</h2>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`${styles.button} ${showAddForm ? styles.buttonSecondary : styles.buttonSuccess}`}
                >
                  {showAddForm ? 'ביטול' : '+ אלבום חדש'}
                </button>
              </div>

              {showAddForm && (
                <div className={styles.addForm}>
                  <input
                    type="text"
                    value={newAlbum}
                    onChange={(e) => setNewAlbum(e.target.value)}
                    placeholder="שם האלבום..."
                    className={styles.addInput}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAlbum()}
                  />
                  <button 
                    onClick={handleAddAlbum}
                    disabled={!newAlbum.trim()}
                    className={`${styles.button} ${styles.buttonSuccess}`}
                  >
                    צור אלבום
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
                  placeholder="חיפוש לפי שם אלבום..."
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.title}>
                רשימת האלבומים ({filteredAlbums.length})
              </h3>

              {filteredAlbums.length === 0 ? (
                <div className={styles.empty}>
                  {(searchById || searchByTitle) 
                    ? '🔍 לא נמצאו אלבומים התואמים לחיפוש'
                    : '📸 עדיין אין אלבומים. צור אלבום ראשון!'}
                </div>
              ) : (
                <div className={styles.albumsList}>
                  {filteredAlbums.map(album => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      isSelected={selectedAlbum?.id === album.id}
                      photoCount={photos[album.id]?.length || 0}
                      onSelect={selectAlbum}
                      onUpdate={handleUpdateAlbum}
                      onDelete={handleDeleteAlbum}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* עמודה ימנית - אלבום נבחר */}
          {selectedAlbum && (
            <div className={styles.selectedAlbumColumn}>
              <SelectedAlbum
                album={selectedAlbum}
                photos={photos[selectedAlbum.id] || []}
                visibleCount={visiblePhotos[selectedAlbum.id] || photosPerLoad}
                loadingPhotos={loadingPhotos[selectedAlbum.id]}
                onLoadMore={handleLoadMorePhotos}
                onAddPhoto={handleAddPhoto}
                onDeletePhoto={handleDeletePhoto}
                onClose={() => setSelectedAlbum(null)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AlbumPage;