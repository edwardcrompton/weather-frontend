const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://temperature-21d9f-default-rtdb.europe-west1.firebasedatabase.app/'
    });
}

exports.handler = async (event, context) => {
  // As an admin, the app has access to read and write all data, regardless of Security Rules
  var db = admin.database();
  var ref = db.ref("temperatures");
  // Fetch the latest temperature
  let snapshot = await ref.orderByChild("timestamp").limitToLast(1).once("value");

  // Extract the value (since Firebase returns an object with keys)
  let latestEntry = snapshot.val();
  let latestTemp = latestEntry ? Object.values(latestEntry)[0] : null;

  return {
    statusCode: 200,
    body: JSON.stringify({latestTemp})
  };
};