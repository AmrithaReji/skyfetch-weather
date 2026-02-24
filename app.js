// Configuration
const apiKey = 'd491517114fa36ec47ad8b61c8342bb6';
const city = 'London'; // Hardcoded city as per requirements
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

// API Call using Axios
axios.get(url)
    .then(response => {
        // Extracting data from the response
        const data = response.data;
        
        // Updating the DOM dynamically
        document.getElementById('city-name').innerText = data.name;
        document.getElementById('temperature').innerText = `${data.main.temp}°C`;
        document.getElementById('description').innerText = data.weather[0].description;
        
        // Setting the weather icon
        const iconCode = data.weather[0].icon;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        console.log("Weather data successfully updated!");
    })
    .catch(error => {
        // Handling errors correctly
        console.error("Error fetching the weather data:", error);
        document.getElementById('city-name').innerText = "Failed to load weather.";
    });