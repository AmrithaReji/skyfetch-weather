// 1. THE CONSTRUCTOR (The Setup)
function WeatherApp() {
    this.apiKey = 'd491517114fa36ec47ad8b61c8342bb6'; // <-- Put your real API key here!
    this.searchBtn = document.getElementById('searchBtn');
    this.cityInput = document.getElementById('cityInput');

    // Requirement: Use .bind(this) so the app knows its own settings when clicked
    this.searchBtn.addEventListener('click', this.getWeather.bind(this));
}

// 2. FETCHING DATA (The Logic)
WeatherApp.prototype.getWeather = function() {
    const city = this.cityInput.value;
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`;

    // Requirement: Use Promise.all() to fetch both APIs at the same time
    Promise.all([fetch(currentUrl), fetch(forecastUrl)])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {
            this.displayCurrent(data[0]);  // Sends current weather data to display
            this.displayForecast(data[1]); // Sends 5-day forecast data to display
        })
        .catch(err => alert("City not found or API error!"));
};

// 3. SHOWING CURRENT WEATHER
WeatherApp.prototype.displayCurrent = function(data) {
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.body.className = data.weather[0].main.toLowerCase();
};

// 4. SHOWING THE 5-DAY FORECAST
WeatherApp.prototype.displayForecast = function(data) {
    const forecastContainer = document.getElementById('forecast-display');
    forecastContainer.innerHTML = ""; // Clear old cards

    // Filter to get weather at 12:00 PM for each day
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h3>${new Date(day.dt_txt).toLocaleDateString('en-US', {weekday: 'short'})}</h3>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${Math.round(day.main.temp)}°C</p>
                <span>${day.weather[0].description}</span>
            </div>
        `;
    });
};

// 5. TURN ON THE APP
const myApp = new WeatherApp();