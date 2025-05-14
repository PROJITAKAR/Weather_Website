let apiKey = "aee91d0c63e3ba5db7424bd06b103e12";
let searchinput = document.querySelector(".searchinput");
let box = document.querySelector(".box");
let normalMessage = document.querySelector(".normal-message");
let errorMessage = document.querySelector(".error-message");
let addedMessage = document.querySelector(".added-message");

// Function to get the date
let date = new Date().getDate();
let months_name = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let months = new Date().getMonth();
let year = new Date().getFullYear();

let FullDate = document.querySelector(".date");
FullDate.innerHTML = `${months_name[months]} ${date}, ${year}`;

// Weather info
async function city(cityName) {
  let url = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`
  );
  if (url.ok) {
    let data = await url.json();
    console.log(data);

    let cityBox = document.querySelector(".city-box");

    if (!box) {
      box = document.createElement("div");
      box.className = "box";
      cityBox.appendChild(box);
    }

    let weatherBox = document.createElement("div");
    weatherBox.className = "weather-box";

    let nameDiv = document.createElement("div");
    nameDiv.className = "name";

    let cityElement = document.createElement("div");
    cityElement.className = "city-name city";
    cityElement.innerHTML = data.name;

    let tempElement = document.createElement("div");
    tempElement.className = "weather-temp temp";
    tempElement.innerHTML = Math.floor(data.main.temp) + "°";

    let weatherIconDiv = document.createElement("div");
    weatherIconDiv.className = "weather-icon";

    let weatherImg = document.createElement("img");
    weatherImg.className = "weather";

    if (data.weather[0].main === "Rain") {
      weatherImg.src = "img/rain.png";
    } else if (data.weather[0].main === "Clear" || data.weather[0].main === "Clear Sky") {
      weatherImg.src = "img/sun.png";
    } else if (data.weather[0].main === "Snow") {
      weatherImg.src = "img/snow.png";
    } else if (
      data.weather[0].main === "Clouds" ||
      data.weather[0].main === "Smoke"
    ) {
      weatherImg.src = "img/cloud.png";
    } else if (
      data.weather[0].main === "Mist" ||
      data.weather[0].main === "Fog"
    ) {
      weatherImg.src = "img/mist.png";
    } else if (data.weather[0].main === "Haze") {
      weatherImg.src = "img/haze.png";
    } else if (data.weather[0].main === "Thunderstorm") {
      weatherImg.src = "img/thunderstorm.png";
    }

    weatherIconDiv.appendChild(weatherImg);
    nameDiv.appendChild(cityElement);
    nameDiv.appendChild(tempElement);
    weatherBox.appendChild(nameDiv);
    weatherBox.appendChild(weatherIconDiv);
    box.appendChild(weatherBox);

    // Inside your city() function, before returning weatherBox

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.style.marginLeft = "10px";

    // Append delete button to weatherBox
    nameDiv.appendChild(deleteBtn);

    // Delete logic
    deleteBtn.addEventListener("click", () => {
      weatherBox.remove(); // remove from UI

      // Remove from localStorage
      let updatedCities = JSON.parse(localStorage.getItem("cities")) || [];
      updatedCities = updatedCities.filter(city => city.toLowerCase() !== data.name.toLowerCase());
      localStorage.setItem("cities", JSON.stringify(updatedCities));
    });


    return weatherBox;

  } else {
    return "";
  }
}

// add section
let section = document.querySelector(".add-section");
let navBtn = document.querySelector(".button");
let navIcon = document.querySelector(".btn-icon");

navBtn.addEventListener("click", () => {
  if (section.style.top === "-60rem") {
    section.style.top = "0px";
    navIcon.className = "fa-solid fa-circle-xmark";
  } else {
    section.style.top = "-60rem";
    navIcon.className = "fa-solid fa-circle-plus";
  }
});

searchinput.addEventListener("keydown", async function (event) {
  if (event.keyCode === 13 || event.which === 13) {
    const cityName = searchinput.value.trim();
    if (!cityName) return;

    const weatherInfo = await city(cityName);
    if (weatherInfo) {
      normalMessage.style.display = "none";
      errorMessage.style.display = "none";
      addedMessage.style.display = "block";

      // Save city to localStorage
      let storedCities = JSON.parse(localStorage.getItem("cities")) || [];
      if (!storedCities.includes(cityName)) {
        storedCities.push(cityName);
        localStorage.setItem("cities", JSON.stringify(storedCities));
      }

      // Auto-close the add section after success
      setTimeout(() => {
        section.style.top = "-60rem";
        navIcon.className = "fa-solid fa-circle-plus";
        searchinput.value = "";
        addedMessage.style.display = "none"; // hide success message after closing
      }, 1500);

    } else {
      normalMessage.style.display = "none";
      errorMessage.style.display = "block";
      addedMessage.style.display = "none";
    }
  }
});



// Load saved cities from localStorage
let savedCities = JSON.parse(localStorage.getItem("cities")) || [];

// If no cities are saved yet, show some defaults
if (savedCities.length === 0) {
  savedCities = ["London", "Paris", "New York", "Mumbai", "Tokyo"];
  localStorage.setItem("cities", JSON.stringify(savedCities));
}

// Load each saved city
savedCities.forEach(cityName => {
  city(cityName);
});


