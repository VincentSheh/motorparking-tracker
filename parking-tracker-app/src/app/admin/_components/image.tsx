"use client"
// LatestImage.tsx
import { useEffect, useState } from 'react';
import { getStorage, listAll, ref, getMetadata } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/utils/firebase';

interface LatestImageProps {
  folderPath: string; // Path to the folder in Firebase Storage
  alt: string; // Alt text for the image
}

const LatestImage: React.FC<LatestImageProps> = ({ folderPath, alt }) => {
  const [latestImageUrl, setLatestImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      const app = initializeApp(firebaseConfig); // Ensure you've imported firebaseConfig
      const storage = getStorage(app);

      const folderRef = ref(storage, folderPath);

      try {
        // List all items in the folder
        const items = await listAll(folderRef);

        // Extract timestamps from file names
        const timestamps = items.items.map((item) => {
          const fileName = item.name;
          const timestamp = parseInt(fileName.split('_')[1], 10);
          return { timestamp, name: fileName };
        });

        // Sort by timestamp in descending order
        timestamps.sort((a, b) => b.timestamp - a.timestamp);

        // Get metadata for the latest image
        const latestImageRef = ref(storage, `${folderPath}/${timestamps[0].name}`);
        const metadata = await getMetadata(latestImageRef);

        // Set the latest image URL
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
