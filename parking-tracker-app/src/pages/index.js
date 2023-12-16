// pages/index.js
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import firebaseConfig from '../path/to/firebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Home = () => {
  const [latestImageUrl, setLatestImageUrl] = useState(null);

  useEffect(() => {
    // Function to get the latest image URL from Firebase
    const getLatestImageUrl = async () => {
      try {
        const storageRef = firebase.storage().ref();
        const imagesRef = storageRef.child('path/to/images'); // Replace with your Firebase storage path

        // List all images in the path
        const imageList = await imagesRef.listAll();

        // Get the latest image
        const latestImage = imageList.items.reduce((prev, current) => {
          return current.timeCreated > prev.timeCreated ? current : prev;
        });

        // Get the download URL of the latest image
        const imageUrl = await latestImage.getDownloadURL();

        setLatestImageUrl(imageUrl);
      } catch (error) {
        console.error('Error fetching latest image:', error);
      }
    };

    // Call the function to get the latest image URL
    getLatestImageUrl();
  }, []);

  return (
    <div>
      <h1>Latest Image</h1>
      {latestImageUrl ? (
        <img src={latestImageUrl} alt="Latest" style={{ maxWidth: '100%' }} />
      ) : (
        <p>No image found in Firebase.</p>
      )}
    </div>
  );
};

export default Home;
