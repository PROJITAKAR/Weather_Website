// API configuration
const weatherApiKey = "aee91d0c63e3ba5db7424bd06b103e12";

// Use browser geolocation to get current position
navigator.geolocation.getCurrentPosition(
  // Success callback when location is available
  async function(position) {
    try {
      // Extract coordinates from position object
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      // Get city name from coordinates using reverse geocoding
      const map = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${weatherApiKey}`
      );
      const userdata = await map.json();
      let loc = userdata[0].name;
      
      // Fetch weather forecast data for the city
      let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
      let respond = await fetch(url + `q=${loc}&` + `appid=${weatherApiKey}`);
      let data = await respond.json();
      
      console.log(data);
      
      // DOM elements for current weather display
      let cityMain = document.getElementById("city-name");
      let cityTemp = document.getElementById("metric");
      let weatherMain = document.querySelectorAll("#weather-main");
      let mainHumidity = document.getElementById("humidity");
      let mainFeel = document.getElementById("feels-like");
      let weatherImg = document.querySelector(".weather-icon");
      let weatherImgs = document.querySelector(".weather-icons");
      let tempMinWeather = document.getElementById("temp-min-today");
      let tempMaxWeather = document.getElementById("temp-max-today");
      
      // Update current weather information in the UI
      cityMain.innerHTML = data.city.name;
      cityTemp.innerHTML = Math.floor(data.list[0].main.temp) + "°";
      weatherMain[0].innerHTML = data.list[0].weather[0].description;
      weatherMain[1].innerHTML = data.list[0].weather[0].description;
      mainHumidity.innerHTML = Math.floor(data.list[0].main.humidity);
      mainFeel.innerHTML = Math.floor(data.list[0].main.feels_like);
      tempMinWeather.innerHTML = Math.floor(data.list[0].main.temp_min) + "°";
      tempMaxWeather.innerHTML = Math.floor(data.list[0].main.temp_max) + "°";
      
      // Set appropriate weather icon based on current condition
      let weatherCondition = data.list[0].weather[0].main.toLowerCase();
      
      if (weatherCondition === "rain") {
        weatherImg.src = "img/rain.png";
        weatherImgs.src = "img/rain.png";
      } else if (weatherCondition === "clear" || weatherCondition === "clear sky") {
        weatherImg.src = "img/sun.png";
        weatherImgs.src = "img/sun.png";
      } else if (weatherCondition === "snow") {
        weatherImg.src = "img/snow.png";
        weatherImgs.src = "img/snow.png";
      } else if (weatherCondition === "clouds" || weatherCondition === "smoke") {
        weatherImg.src = "img/cloud.png";
        weatherImgs.src = "img/cloud.png";
      } else if (weatherCondition === "mist" || weatherCondition === "fog") {
        weatherImg.src = "img/mist.png";
        weatherImgs.src = "img/mist.png";
      } else if (weatherCondition === "haze") {
        weatherImg.src = "img/haze.png";
        weatherImgs.src = "img/haze.png";
      } else if (weatherCondition === "thunderstorm") {
        weatherImg.src = "img/thunderstorm.png";
        weatherImgs.src = "img/thunderstorm.png";
      }
      
      // Fetch extended forecast data
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city.name}&appid=${weatherApiKey}&units=metric`;
      
      fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
          console.log("5-Day Forecast for", data.city.name);
          displayForecast(data);
        })
        .catch(error => {
          console.error("Error fetching forecast:", error);
        });
        
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
  // Error callback when location access is denied
  () => {
    alert("Please turn on your location and refresh the page");
  }
);

/**
 * Processes and displays forecast data in the UI
 */
function displayForecast(data) {
  const dailyForecasts = {};
  let forecast = document.getElementById('weekly-outlook-box');
  let forecastbox = "";
  
  // Process forecast data by day
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = new Date(date).getDay();
    
    // Store only the first entry for each day
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        day_today: dayName[day],
        temperature: Math.floor(item.main.temp) + "°",
        description: item.weather[0].description,
        weatherImg: item.weather[0].main.toLowerCase()
      };
    }
  });
  
  // Generate HTML for each forecast day
  for (const date in dailyForecasts) {
    let imgSrc = "";
    
    switch (dailyForecasts[date].weatherImg) {
      case "rain":
        imgSrc = "img/rain.png";
        break;
      case "clear":
      case "clear sky":
        imgSrc = "img/sun.png";
        break;
      case "snow":
        imgSrc = "img/snow.png";
        break;
      case "clouds":
      case "smoke":
        imgSrc = "img/cloud.png";
        break;
      case "mist":
        imgSrc = "img/mist.png";
        break;
      case "haze":
        imgSrc = "img/haze.png";
        break;
      case "thunderstorm":
        imgSrc = "img/thunderstorm.png";
        break;
      default:
        imgSrc = "img/sun.png";
    }
    
    forecastbox += `
    <div class="day-card">
      <div class="day-weather">
        <span>${dailyForecasts[date].day_today}</span>
      </div>
      <div class="weather-icon-forecast">
        <img src="${imgSrc}" />
      </div>
      <div class="temp-weather">
        <span>${dailyForecasts[date].temperature}</span>
      </div>
      <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
    </div>`;
  }
  
  // Update the forecast container with generated HTML
  forecast.innerHTML = forecastbox;
  
  console.log(data);
}