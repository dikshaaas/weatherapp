const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");

const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#error");

const cityName = document.querySelector("#cityName");
const country = document.querySelector("#countryName");
const temperature = document.querySelector("#temperature");
const feelslike = document.querySelector("#feelslike");
const humidity = document.querySelector("#humidity");
const description = document.querySelector("#description");

searchButton.addEventListener("click", function(){
    
    const city= cityInput.value.trim();

    if(city === ""){
        errorMessage.textContent= "Please enter a city name.";
        return;
    }

    getWeather(city);
});


//geocoding api to convert the cities into their longitude and latitude form 
async function getWeather(city){
    
    loading.textContent = "Loading...";
    errorMessage.textContent = "";

    try{
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok){
        throw new Error("Unable to find the city.");
    }

    const geoData = await geoResponse.json();

    if(!geoData.results){
        throw new Error("City not found");
    }

    const location = geoData.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);
     if(!weatherResponse.ok){
        throw new Error("Unable to get weather data");
    }

    const weatherData = await weatherResponse.json();

    const temp = weatherData.current.temperature_2m;
    const app = weatherData.current.apparent_temperature;
    const rel = weatherData.current.relative_humidity_2m;

    const weatherDescription= getWeatherDescription(weatherData.current.weather_code);

    cityName.textContent = location.name;
    country.textContent = location.country;
    temperature.textContent = `Real Temperature: ${temp}\u00B0C`;
    feelslike.textContent = `Feels like: ${app}\u00B0C`;
    humidity.textContent = `Humidity: ${rel}%`
    description.textContent = weatherDescription;

    }catch (error){
        errorMessage.textContent = error.message;

    }finally{
        loading.textContent ="";
    }

}
function getWeatherDescription(code){
    if(code === 0){
        return "Clear sky";
    }
    if (code === 1 || code === 2 || code === 3) {
        return "Cloudy";
    }

    if (code === 45 || code === 48) {
        return "Fog";
    }

    if (code >= 51 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown weather";
}