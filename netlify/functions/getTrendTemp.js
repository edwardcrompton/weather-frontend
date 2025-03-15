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
  const queryParams = event.queryStringParameters;
  const hours = queryParams && queryParams.hours ? parseInt(queryParams.hours, 10) : 1;

  if (isNaN(hours) || hours <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid hours parameter' })
    };
  }

  const currentTime = Date.now();
  const pastTime = (currentTime - (hours * 60 * 60 * 1000)) * 1000;

  var db = admin.database();
  var ref = db.ref("temperatures");
  
  // Fetch all the temperatures since pastTime
  let snapshot = await ref
    .orderByChild("timestamp")
    .startAt(pastTime)
    .once("value");

  let temperatures = [];
  snapshot.forEach(childSnapshot => {
    const data = childSnapshot.val();
    temperatures.push({
      temperature: data.temperature,
      timestamp: data.timestamp
    });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      since: pastTime,
      count: temperatures.length,
      temperatures,
    })
  };
};