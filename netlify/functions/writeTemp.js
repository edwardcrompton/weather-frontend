const sqlite3 = require('sqlite3').verbose();
const path = require('path');

exports.handler = async function(event, context) {
    const { timestamp, temperature } = JSON.parse(event.body);

    if (!timestamp || !Number.isInteger(temperature)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid input' })
        };
    }

    const dbPath = path.resolve(__dirname, '../weather.db');
    const db = new sqlite3.Database(dbPath);

    return new Promise((resolve, reject) => {
        db.run('CREATE TABLE IF NOT EXISTS temperatures (timestamp TEXT, temperature INTEGER)', (err) => {
            if (err) {
                db.close();
                return reject({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Failed to create table' })
                });
            }

            db.run('INSERT INTO temperatures (timestamp, temperature) VALUES (?, ?)', [timestamp, temperature], (err) => {
                db.close();

                if (err) {
                    return reject({
                        statusCode: 500,
                        body: JSON.stringify({ error: 'Failed to insert data' })
                    });
                }

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Data inserted successfully' })
                });
            });
        });
    });
};