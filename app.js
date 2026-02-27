function WeatherApp() {
    this.apiKey = 'd491517114fa36ec47ad8b61c8342bb6';
    this.searchBtn = document.getElementById('searchBtn');
    this.cityInput = document.getElementById('cityInput');
    this.recentContainer = document.getElementById('recent-searches');
    this.errorMsg = document.getElementById('errorMessage');

    this.searchBtn.addEventListener('click', () => this.getWeather());

    // TASK: Automatically load last searched city from localStorage
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        this.getWeather(lastCity);
    }
    this.renderHistory();
}

WeatherApp.prototype.getWeather = function(cityOverride) {
    const city = cityOverride || this.cityInput.value;
    if (!city) return;

    this.errorMsg.innerText = ""; 

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`;

    Promise.all([fetch(currentUrl), fetch(forecastUrl)])
        .then(responses => {
            if (!responses[0].ok) throw new Error("City not found");
            return Promise.all(responses.map(res => res.json()));
        })
        .then(data => {
            this.displayCurrent(data[0]);
            this.displayForecast(data[1]);
            
            // TASK: Save city to localStorage for persistence
            localStorage.setItem('lastCity', city);
            this.saveToHistory(city);
        })
        .catch(err => {
            this.errorMsg.innerText = "Error: " + err.message;
        });
};

WeatherApp.prototype.saveToHistory = function(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history.slice(-5)));
    }
    this.renderHistory();
};

WeatherApp.prototype.renderHistory = function() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    this.recentContainer.innerHTML = history.map(city => 
        `<button class="recent-btn" onclick="weatherApp.getWeather('${city}')">${city}</button>`
    ).join('');
};

WeatherApp.prototype.displayCurrent = function(data) {
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('wind-speed').innerText = data.wind.speed;
    const iconCode = data.weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

WeatherApp.prototype.displayForecast = function(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ""; 
    
    // Get one forecast per day (every 8th index)
    const dailyData = data.list.filter((item, index) => index % 8 === 0);

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const card = `
            <div class="forecast-card">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${Math.round(day.main.temp)}°C</p>
            </div>`;
        forecastContainer.innerHTML += card;
    });
};// ... Your displayCurrent and displayForecast methods from Part 3 ...

const weatherApp = new WeatherApp();