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

  const getStatus = (value, thresholds) => {
    if (value < thresholds[0]) return 'Low';
    if (value < thresholds[1]) return 'Normal';
    return 'High';
  };

  return (
    <div className="App">
      <h1>Air Quality Measurement</h1>
      <button onClick={goToHistory} className="button">View History</button>
    
      <div className="gauge-container">
        <div className="gauge-row">
          <div className="gauge-item">
            <Gauge label="CO" value={data.CO} minValue={0} maxValue={10} unit="PPM" />
            <p className="status">
              {getStatus(data.CO, [4, 9])} 
            </p>
          </div>
          <div className="gauge-item">
            <Gauge label="NO2" value={data.NO2} minValue={0} maxValue={0.1} unit="PPM" />
            <p className="status">
              {getStatus(data.NO2, [0.03, 0.05])} 
            </p>
          </div>
          <div className="gauge-item">
            <Gauge label="Oxygen" value={data.Oxygen} minValue={10} maxValue={40} unit="%" />
            <p className="status">
              {getStatus(data.Oxygen, [19, 22])} 
            </p>
          </div>
        </div>
        <div className="gauge-row">
          <div className="gauge-item">
            <Gauge label="Temperature" value={data.Temperature} minValue={0} maxValue={50} unit="°C" />
            <p className="status">
              {getStatus(data.Temperature, [16, 30])} 
            </p>
          </div>
          <div className="gauge-item">
            <Gauge label="Dust Level" value={data.Dust} minValue={0} maxValue={30} unit="µg/m³" />
            <p className="status">
              {getStatus(data.Dust, [5, 10])} 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
