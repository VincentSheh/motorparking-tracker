import React from 'react';

const MotorparkingTrackerList: React.FC = () => {
  return (
    <div className="border border-blue-300 rounded p-4 ring ring-blue-300 ring-opacity-50">
      <h2 className="text-2xl font-bold mb-4">How Motorparking Tracker Works</h2>
      <ul className="list-disc pl-6">
        <li>User opens the Motorparking Tracker app on their device.</li>
        <li>The app detects the user's current location using GPS.</li>
        <li>User selects "Start Parking" to initiate tracking.</li>
        <li>The app records the parking location and time.</li>
        <li>User can view the parking history and current location on the map.</li>
        <li>Receive notifications when the parking session is about to expire.</li>
        <li>User ends the parking session when they return to their vehicle.</li>
        <li>The app provides directions to the parked vehicle if needed.</li>
        <li>Users can customize settings and preferences within the app.</li>
        <li>Motorparking Tracker helps users efficiently manage their parking activities.</li>
      </ul>
    </div>
  );
};

export default MotorparkingTrackerList;
