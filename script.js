document.addEventListener('DOMContentLoaded', () => {
    const loadingSpinner = document.getElementById('loadingSpinner');

    const fetchAndRenderChart = (hours) => {
        loadingSpinner.style.display = 'block'; // Show loading spinner
        fetch(`.netlify/functions/getTrendTemp?hours=${hours}`)
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('temperatureChart').getContext('2d');
                const labels = data.temperatures.map(entry => new Date(entry.timestamp / 1000).toLocaleString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' }));
                const temperatures = data.temperatures.map(entry => (entry.temperature / 1000).toFixed(1));

                if (window.temperatureChart) {
                    if (window.temperatureChart && typeof window.temperatureChart.destroy === 'function') {
                        window.temperatureChart.destroy(); // Destroy the previous chart instance
                    }
                }

                window.temperatureChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Temperature (°C)',
                            data: temperatures,
                            borderColor: 'rgba(75, 192, 192, 1)', // Cyan line
                            borderWidth: 1,
                            fill: false,
                            pointRadius: 0 // Remove datapoint markers
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false // Remove legend
                            }
                        },
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
            .finally(() => {
                loadingSpinner.style.display = 'none'; // Hide loading spinner
            })
            .catch(error => {
                console.error('Error fetching temperature trend:', error);
            });
    };

    // Initial chart render with default 24 hours
    fetchAndRenderChart(24);

    // Handle radio button changes
    document.querySelectorAll('input[name="timeRange"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const hours = event.target.value;
            fetchAndRenderChart(hours);
        });
    });

    // Fetch and display the latest temperature
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
