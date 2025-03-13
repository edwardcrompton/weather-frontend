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

    fetch('.netlify/functions/getTrendTemp?hours=24')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('temperatureChart').getContext('2d');
            const labels = data.temperatures.map(entry => new Date(entry.timestamp).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false }));
            const temperatures = data.temperatures.map(entry => (entry.temperature / 1000).toFixed(1));

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: temperatures,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Temperature (°C)'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching temperature trend:', error);
        });
});
