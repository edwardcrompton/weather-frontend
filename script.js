document.addEventListener('DOMContentLoaded', () => {
    fetch('.netlify/functions/getLatestTemp')
        .then(response => response.json())
        .then(data => {
            const temperatureElement = document.getElementById('temperature');
            const temperature = (data.latestTemp.temperature / 1000).toFixed(1);
            temperatureElement.textContent = `${temperature}°C`;
        })
        .catch(error => {
            console.error('Error fetching temperature:', error);
        });
});
