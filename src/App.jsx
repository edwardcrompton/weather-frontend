import './App.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [rows, setRows] = useState(null);
  const SHEET_ID = '1wX7WssPkwmh9BJ48worzy3YpNaTzXm-Lkn_TuMMKiuE';  // Replace with your actual Google Sheet ID
  const API_KEY = 'AIzaSyCj3GqDrlwT8lsPiSs-3-eG5JQAwdNDxJ0';
  const RANGE = 'Sheet1';  // Adjust if necessary, 'Sheet1' is the name of your sheet

  // Function to fetch the last row from Google Sheets
  const fetchRows = async () => {
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
      );
      const rows = response.data.values;
      if (rows.length > 0) {
        setRows(rows);
      }
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
    }
  };

  useEffect(() => {
    fetchRows();  // Fetch data on component mount
  }, []);

  if (!rows) return null;

  var latest = rows[rows.length - 1][1] / 1000;
  var latestRounded = Math.round(latest * 10) / 10;
  var updated = rows[rows.length - 1][0];

  // @todo: Needs updating in case the sample rate is greater or less than 1 per hour.
  var last24 = rows.slice(-24);

  last24.sort(function(a, b) {
    return parseFloat(a[1]) - parseFloat(b[1]);
  });

  var min = Math.round(last24[0][1] / 1000 * 10) / 10;
  var max = Math.round(last24[last24.length - 1][1] / 1000 * 10) / 10;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Local conditions</h1>
        {rows ? (
        <div>  
          <div>
            <h3>Latest</h3>
            <span>{latestRounded}&deg;C</span>
          </div>
          <div>
            <h3>Last 24 hours</h3>
            <div>Max: {max}&deg;C</div>
            <div>Min: {min}&deg;C</div>
          </div>
          <div>
            <h3>Updated</h3>
            {updated}
          </div>
        </div>  
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
};

export default App;

