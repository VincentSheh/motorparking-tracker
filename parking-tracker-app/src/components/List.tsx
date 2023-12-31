import Link from 'next/link';
import React from 'react';

const MotorparkingTrackerList: React.FC = () => {
  return (
    <div className="border border-blue-300 rounded p-4 ring ring-blue-300 ring-opacity-50">
      <h2 className="text-2xl font-bold mb-4">How Motorparking Tracker Works</h2>
      <ul className="list-disc pl-6">
        <li>By clicking You Agree to our terms and services</li>
        <li>Click here to learn more about our terms & agreeements</li>
        <li>User opens the Motorparking Tracker app on their device.</li>
        <li>The app detects the user current location using GPS.</li>
        <li>User can view the parking information including latest pictures.</li>
        <li>Motorparking Tracker helps users efficiently manage their parking activities.</li>
      </ul>
    </div>
  );
};

export default MotorparkingTrackerList;
