# Weather Frontend

This project is a weather monitoring frontend that displays the latest temperature and a temperature trend chart for a selected time range. It is built using HTML, CSS, JavaScript, and Chart.js, and integrates with a backend API hosted on Netlify.

Data is collected by a Raspberry Pi connected to a thermometer in my garden. 

The repository containing the code that runs on the Raspberry Pi to record the data is https://github.com/edwardcrompton/rpi-temp

See this frontend in action at https://thriving-moonbeam-0aff39.netlify.app/

## Features

- **Latest Temperature Display**: Shows the most recent temperature reading along with the timestamp of the last update.
- **Temperature Trend Chart**: Displays a line chart of temperature trends for the selected time range (24 hours, 48 hours, or 1 week).
- **API Endpoints**: Includes two Netlify functions providing API endpoints to access temperature data from a Firebase database.

## How It Works

1. **Latest Temperature**:
   - The frontend fetches the latest temperature data from the `.netlify/functions/getLatestTemp` endpoint.
   - The temperature and timestamp are displayed at the top of the page.

2. **Temperature Trend Chart**:
   - The chart fetches data from the `.netlify/functions/getTrendTemp` endpoint with a configurable `hours` parameter.
   - The chart updates dynamically when the user selects a different time range.

3. **Responsive Adjustments**:
   - On screens less than 400px wide, the chart width is limited to 100% of the screen, and axis titles are hidden for better readability.
   - Radio buttons are proportionally larger on mobile screens for easier interaction.

## File Structure

- **index.html**: The main HTML file containing the structure of the page, including the chart and radio buttons.
- **styles.css**: Contains the styles for the page, including responsive design and the animated loading spinner.
- **script.js**: Handles fetching data from the backend, rendering the chart, and managing user interactions.
- **.github/workflows/netlify-deploy.yml**: GitHub Actions workflow for deploying the project to Netlify.
- **netlify/functions/getLatestTemp.js**: Backend function to fetch the latest temperature data from Firebase.

## Setup and Deployment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weather-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy to Netlify:
   - Ensure you have a valid `NETLIFY_AUTH_TOKEN` and `FIREBASE_SERVICE_ACCOUNT` configured in your environment.
   - Push changes to the `feature/microservice` branch to trigger the GitHub Actions workflow for deployment.

## API Endpoints

- **GET /netlify/functions/getLatestTemp**:
  - Returns the latest temperature and timestamp in JSON format. The temperature is provided as an integer with three decimal places but no decimal point, so it must be divided by 1000 to get the centigrade value.
  - Example response:
    ```json
    {
      "temperature": 25300,
      "timestamp": "2023-03-15T12:00:00Z"
    }
    ```

- **GET /netlify/functions/getTrendTemp?hours=<hours>**:
  - Returns an array of temperature readings for the specified time range. Each temperature is provided as an integer with three decimal places but no decimal point, so it must be divided by 1000 to get the centigrade value.
  - Example response:
    ```json
    {
      "temperatures": [
        { "timestamp": 1678886400000, "temperature": 25300 },
        { "timestamp": 1678890000000, "temperature": 24800 }
      ]
    }
    ```

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Backend**: Firebase Realtime Database, Netlify Functions
- **Deployment**: Netlify, GitHub Actions
