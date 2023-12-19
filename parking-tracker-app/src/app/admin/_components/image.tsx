import { useEffect, useState } from 'react';
import { getStorage, listAll, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/utils/firebase';
import { Grid, Card, CardMedia } from '@mui/material';

interface LatestImageProps {
  folderPath: string;
  alt: string;
}

const Image: React.FC<LatestImageProps> = ({ folderPath, alt }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);

      const folderRef = ref(storage, folderPath);

      try {
        const items = await listAll(folderRef);
        const imageUrlPromises = items.items.map(async (item) => {
          const downloadURL = await getDownloadURL(item);
          return downloadURL;
        });

        const imageUrlArray = await Promise.all(imageUrlPromises);
        setImageUrls(imageUrlArray);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    initializeFirebase();
  }, [folderPath]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Grid container spacing={2} style={{ overflowY: 'auto', maxHeight: '700px' }}>
      {imageUrls.map((url, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <CardMedia component="img" alt={alt} height="140" image={`${url}?${new Date().getTime()}`} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Image;
