const apiKey = 'd491517114fa36ec47ad8b61c8342bb6'; // Replace with your actual API key

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const loadingText = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

// Function using async/await and try-catch (Assignment Requirement)
async function getWeatherData(city) {
    try {
        // Show loading state
        loadingText.style.display = "block";
        errorMessage.textContent = "";
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        
        // Handle Invalid city names
        if (!response.ok) {
            throw new Error("City not found. Please try again.");
        }

        const data = await response.json();
        updateUI(data);

    } catch (error) {
        // User-friendly error messages
        errorMessage.textContent = error.message;
        document.body.className = 'error-bg'; // Optional: change bg on error
    } finally {
        // Hide loading indicator
        loadingText.style.display = "none";
    }
}

function updateUI(data) {
    // 1. Dynamic Backdrop Logic
    const mainWeather = data.weather[0].main.toLowerCase();
    document.body.className = ''; // Reset classes
    
    if (mainWeather.includes("clear")) {
        document.body.classList.add('clear');
    } else if (mainWeather.includes("cloud")) {
        document.body.classList.add('clouds');
    } else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) {
        document.body.classList.add('rain');
    } else if (mainWeather.includes("snow")) {
        document.body.classList.add('snow');
    }

    // 2. Update Text Content
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Event listener for user interaction
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        errorMessage.textContent = "Please enter a city name."; // Input validation
    }
});