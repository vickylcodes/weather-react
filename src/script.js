let currentTime = new Date();

let hours = currentTime.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}

let minutes = currentTime.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
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

let h3 = document.querySelector("#date");
h3.innerHTML = `${days[currentTime.getDay()]}, ${currentTime.getDate()} ${
  months[currentTime.getMonth()]
} ${currentTime.getFullYear()} / ${hours}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col-xs-2">
              <div class="weather-forecast-date">
                <strong> ${formatDay(forecastDay.dt)} </strong>
                <br />
                  <img
                      id="forecast-icon" 
                      src="http://openweathermap.org/img/wn/${
                        forecastDay.weather[0].icon
                      }@2x.png"
                      alt=""
                />
                <br />
                <div class="weather-forecast-temperatures">
                  <span class="weather-forecast-temperature-max">
                  ${Math.round(forecastDay.temp.max)}°C </span> /
                  <span class="weather-forecast-temperature-min">
                  ${Math.round(forecastDay.temp.min)}°C </span>
                </div>
                <div class="atmosphere-paragraph">
                  Humidity: 60% <br />
                  Wind: 8 km/h
                </div>
              </div>
            </div>
          
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiKey = "91976109f2a91771f09b69d01c0d52a3";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?&lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayCelsiusTemperature);
}

navigator.geolocation.getCurrentPosition(showPosition);

function getForecast(coordinates) {
  let apiKey = "91976109f2a91771f09b69d01c0d52a3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  document.querySelector(`#city`).innerHTML = response.data.name;
  document.querySelector(`#temperature`).innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector(`#humidity`).innerHTML = response.data.main.humidity;
  document.querySelector(`#wind`).innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  celsiusTemperature = response.data.main.temp;

  let iconElement = document.querySelector("#icon");

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
  console.log(response.data);
}

function searchCity(city) {
  let apiKey = "91976109f2a91771f09b69d01c0d52a3";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector(`#city-input`).value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "91976109f2a91771f09b69d01c0d52a3";
  let units = "metric";
  let apiUrl = `https://api.org/data/2.5/weather?lat=${position.coords.lat}&lon=${position.coords.lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsiusTemperature(event) {
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayCelsiusTemperature(response) {
  let currentTemperature = Math.round(response.data.main.temp);
  let cityElement = response.data.name;
  let h2 = document.querySelector("#current");
  h2.innerHTML = `It is currently ${currentTemperature}°C in ${cityElement}!`;
}

let celsiusTemperature = null;

let cityForm = document.querySelector("#search-form");
cityForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

searchCity("New York");
