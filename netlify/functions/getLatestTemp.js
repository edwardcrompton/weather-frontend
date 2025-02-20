const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBPATH = path.join(__dirname, '../weather.db');

exports.handler = async function (event, context) {
  let db = new sqlite3.Database(DBPATH);

  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM temperatures ORDER BY timestamp DESC LIMIT 1', [], (err, row) => {
      if (err) {
        console.error('Error fetching data from SQLite database', err);
        resolve({
          statusCode: 500,
          body: 'Error fetching data from SQLite database',
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify(row),
        });
      }
    });

    db.close((err) => {
      if (err) {
        console.error('Error closing the database connection', err);
      }
    });
  });
};
