const admin = require('firebase-admin');
//const functions = require('@netlify/functions');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../../credentials.json'));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp(serviceAccount);
}

exports.handler = async (event, context) => {
    try {
        const { timestamp, temperature } = JSON.parse(event.body);

        if (!timestamp || !Number.isInteger(temperature)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input' })
            };
        }

        const db = admin.database();
        const ref = db.ref('temperatures');

        await ref.push({
            timestamp,
            temperature
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data written successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};