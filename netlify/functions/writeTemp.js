const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const validToken = process.env.MICROSERVICE_BEARER_TOKEN; // Add a valid token in your environment variables

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://temperature-21d9f-default-rtdb.europe-west1.firebasedatabase.app/'
    });
}

exports.handler = async (event, context) => {
    try {
        // Check for a valid bearer token
        const authHeader = event.headers.authorization || '';
        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        if (token !== validToken) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Forbidden: Invalid token' })
            };
        }

        const { timestamp, temperature } = JSON.parse(event.body);

        if (!timestamp || typeof temperature !== 'number') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input: timestamp must be provided and temperature must be a number' })
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