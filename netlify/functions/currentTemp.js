const { google } = require('googleapis');
const path = require('path');   

const KEYFILEPATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const spreadsheetId = '1JqRl_vdU9A14fVncYei6DGJOGLMOE7niceTmKDHTUmY';
const range = 'Sheet1';

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

exports.handler = async function (event, context) {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${range}`,
    });

    const rows = response.data.values;
    if (rows.length) {
      const lastRow = rows[rows.length - 1];
      return {
        statusCode: 200,
        body: JSON.stringify(lastRow),
      };
    } else {
      return {
        statusCode: 200,
        body: 'No data found.',
      };
    }
  } catch (error) {
    console.error('Error fetching data from Google Sheets', error);
    return {
      statusCode: 500,
      body: 'Error fetching data from Google Sheets',
    };
  }
};
