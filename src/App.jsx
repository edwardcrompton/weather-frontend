import './App.css';

import React, { useEffect, useState, PureComponent } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';
import moment from 'moment';

const App = () => {
  const [rows, setRows] = useState(null);
  const SHEET_ID = '1wX7WssPkwmh9BJ48worzy3YpNaTzXm-Lkn_TuMMKiuE';  // Replace with your actual Google Sheet ID
  const API_KEY = 'AIzaSyCj3GqDrlwT8lsPiSs-3-eG5JQAwdNDxJ0';
  const RANGE = 'Sheet1';  // Adjust if necessary, 'Sheet1' is the name of your sheet
  const DATEFORMAT = 'YYYY-MM-DD HH:mm';

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
  function getDataPointsInLast(dataPoints, value, unit) {
    var targetTime = moment().subtract(value, unit).format('YYYY-MM-DD HH:mm');
    
    // Find the first index where the time is greater than targetTime
    const index = dataPoints.findIndex((dataPoint) => moment(dataPoint[0], DATEFORMAT).isAfter(targetTime));
    
    // If such an index is found, slice the array from that point
    if (index !== -1) {
      return dataPoints.slice(index);
    }
  
    // If no time is greater than targetTime, return an empty array
    return [];
  }

  var last24 = getDataPointsInLast(rows, 24, 'hours');

  var data = last24.map((dataPoint) => ({
    time: moment(dataPoint[0], DATEFORMAT).unix(),
    temp: dataPoint[1] / 1000
  })); 

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
          <h3>Trend</h3>
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number"
              dataKey="time"
              domain={['auto', 'auto']}
              tickFormatter={(xdata) => moment(xdata, 'X', true).format('HH:mm')}
              name="Time"
              />
            <YAxis 
              type="number"
              name="Temperature"
              />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>  
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
};

export default App;

