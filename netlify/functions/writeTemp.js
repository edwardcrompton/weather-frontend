const admin = require('firebase-admin');
//const functions = require('@netlify/functions');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://temperature-21d9f-default-rtdb.europe-west1.firebasedatabase.app/'
    });
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