document.addEventListener('DOMContentLoaded', () => {
    fetch('.netlify/functions/getLatestTemp')
        .then(response => response.json())
        .then(data => {
            const temperatureElement = document.getElementById('temperature');
            const timestampElement = document.getElementById('timestamp');
            const temperature = (data.temperature / 1000).toFixed(1);
            const timestamp = new Date(data.timestamp).toLocaleString('en-GB', { timeZone: 'UTC', hour12: false });

            temperatureElement.textContent = `${temperature}°C`;
            timestampElement.textContent = `Last updated: ${timestamp}`;
        })
        .catch(error => {
            console.error('Error fetching temperature:', error);
        });
});
