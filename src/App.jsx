import './App.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [lastRow, setLastRow] = useState(null);
  const SHEET_ID = '1wX7WssPkwmh9BJ48worzy3YpNaTzXm-Lkn_TuMMKiuE';  // Replace with your actual Google Sheet ID
  const API_KEY = 'AIzaSyCj3GqDrlwT8lsPiSs-3-eG5JQAwdNDxJ0';
  const RANGE = 'Sheet1';  // Adjust if necessary, 'Sheet1' is the name of your sheet

  // Function to fetch the last row from Google Sheets
  const fetchLastRow = async () => {
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
      );
      const rows = response.data.values;
      if (rows.length > 0) {
        setLastRow(rows[rows.length - 1]);  // Set the last row
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
    }
  };

  useEffect(() => {
    fetchLastRow();  // Fetch data on component mount
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recent temperature</h1>
        {lastRow ? (
          <div>
            <h3>Latest</h3>
            <ul>
              {lastRow.map((cell, index) => (
                <span>{cell},</span>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
};

export default App;

