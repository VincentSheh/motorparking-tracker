"use client"
import { useEffect, useState } from 'react';
import { getStorage, listAll, ref, getDownloadURL} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/utils/firebase';

interface LatestImageProps {
  folderPath: string;
  alt: string;
}

const Image: React.FC<LatestImageProps> = ({ folderPath, alt }) => {
    const [latestImageUrl, setLatestImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const initializeFirebase = async () => {
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
  
        const folderRef = ref(storage, folderPath);
  
        try {
          const items = await listAll(folderRef);
          const timestamps = items.items.map((item) => {
            const fileName = item.name;
            const timestamp = parseInt(fileName.split('_')[1], 10);
            return { timestamp, name: fileName };
          });
  
          timestamps.sort((a, b) => b.timestamp - a.timestamp);
  
          const latestImageRef = ref(storage, `${folderPath}/${timestamps[0].name}`);
          const downloadURL = await getDownloadURL(latestImageRef);
  
          setLatestImageUrl(downloadURL);
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {latestImageUrl && <img src={`${latestImageUrl}?${new Date().getTime()}`} alt={alt} style={{ width: '50%', height: 'auto' }} />}
          </div>
    );
  };
  
  export default Image;