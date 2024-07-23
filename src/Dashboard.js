import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Gauge from './Gauge';
import { database } from './firebase';
import './App.css';

const Dashboard = () => {
  const [data, setData] = useState({
    CO: 0,
    NO2: 0,
    Oxygen: 0,
    Temperature: 0,
    Dust: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const dbRef = ref(database, 'Gas value');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const newData = snapshot.val();
      if (newData) {
        setData(newData);
      } else {
        console.error('No data available');
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const goToHistory = () => {
    navigate('/history');
  };

  return (
    <div className="App">
      <h1>Air Quality Measurement</h1>
      <button onClick={goToHistory} className="button">View History</button>
    
      <div className="gauge-container">
        <div className="gauge-row">
          <Gauge label="CO" value={data.CO} minValue={0} maxValue={10} unit="PPM" />
          <Gauge label="NO2" value={data.NO2} minValue={0} maxValue={10} unit="PPM" />
          <Gauge label="Oxygen" value={data.Oxygen} minValue={0} maxValue={100} unit="%" />
        </div>
        <div className="gauge-row">
          <Gauge label="Temperature" value={data.Temperature} minValue={0} maxValue={50} unit="°C" />
          <Gauge label="Dust Level" value={data.Dust} minValue={0} maxValue={10} unit="µg/m³" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
