import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import './History.css';

const History = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dbRef = ref(database, 'Gas value');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Fetched data:', data); // For debugging
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          timestamp: key,
          ...data[key]
        }));
        console.log('Formatted data:', formattedData); // For debugging
        setData(formattedData);
      }
    });
  }, []);

  return (
    <div className="history-container">
      <h1>History Data</h1>
      <div className="history-table">
        <div className="history-header">
          <div>Timestamp</div>
          <div>CO</div>
          <div>Dust</div>
          <div>NO2</div>
          <div>Oxygen</div>
          <div>Temperature</div>
        </div>
        {data.length > 0 ? (
          data.map((entry) => (
            <div className="history-row" key={entry.timestamp}>
              <div>{entry.timestamp}</div>
              <div>{entry.CO !== undefined ? entry.CO.toFixed(2) : 'N/A'}</div>
              <div>{entry.Dust !== undefined ? entry.Dust.toFixed(2) : 'N/A'}</div>
              <div>{entry.NO2 !== undefined ? entry.NO2.toFixed(2) : 'N/A'}</div>
              <div>{entry.Oxygen !== undefined ? entry.Oxygen.toFixed(2) : 'N/A'}</div>
              <div>{entry.Temperature !== undefined ? entry.Temperature.toFixed(2) : 'N/A'}</div>
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
};

export default History;
