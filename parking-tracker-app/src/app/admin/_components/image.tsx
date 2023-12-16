"use client"
import { useEffect, useState } from 'react';
import { getStorage, listAll, ref, getMetadata } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/utils/firebase';

interface LatestImageProps {
  folderPath: string;
  alt: string;
}

const LatestImage: React.FC<LatestImageProps> = ({ folderPath, alt }) => {
  const [latestImageUrl, setLatestImageUrl] = useState<string | null>(null);

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
        const metadata = await getMetadata(latestImageRef);

        setLatestImageUrl(metadata.fullPath);
      } catch (error) {
        console.error('Error fetching latest image:', error);
      }
    };

    initializeFirebase();
  }, [folderPath]);

  return (
    <div>
      {latestImageUrl && <img src={latestImageUrl} alt={alt} />}
    </div>
  );
};

export default LatestImage;
