document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        this.innerText = 'Light Mode';
    } else {
        this.innerText = 'Dark Mode';
    }
});

// Geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
        getWeather(position.coords.latitude, position.coords.longitude);
    });
} else {
    alert('Geolocation is not supported by this browser.');
}

const apiKey = '7a31f406b496d7d110540063fea1172a';
const apiBase = 'https://api.openweathermap.org/data/2.5/';

function getWeather(lat, lon) {
    fetch(`${apiBase}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const now = new Date();
            const today = daysOfWeek[now.getDay()];
            const time = now.toLocaleTimeString();

            document.getElementById('current-weather').innerHTML = `
              <h2>${data.name}</h2>
              <div class="day"><h4>${today}</h4></div>
              <div class="time"><h6>${time}</h6></div>
              <br>
              <div class="temp-icon-container">
              <div class="weather-icon current-weather-icon"><i class="fas ${getWeatherIcon(data.weather[0].main)}"></i></div>
              <h2 class="current-temperature">${Math.round(data.main.temp)}°C</h2>
              </div>
              <p>Weather: ${data.weather[0].description}</p>
              <p>Humidity: ${data.main.humidity}%</p>
              <p>Wind Speed: ${data.wind.speed} m/s</p>
              <p><i class="fas fa-map-marker-alt"></i> Latitude: ${lat}, Longitude: ${lon}</p>
          `;
        })
        .catch(error => console.error('Error fetching weather data:', error));

    getForecast(lat, lon);
    getHourlyForecast(lat, lon);
}


function getForecast(lat, lon) {
    fetch(`${apiBase}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            let forecastHtml = '';
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            let today = new Date().getDay();

            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                const dayDate = new Date(day.dt * 1000);
                const dayName = daysOfWeek[dayDate.getDay()];

                forecastHtml += `
                  <div class="forecast-day ${dayDate.getDay() === today ? 'current-day' : ''}">
                      <div class="day"><h6>${dayName}</h6></div>
                      <div class="weather-icon"><i class="fas ${getWeatherIcon(day.weather[0].main)}"></i></div>
                      <br>
                      <h3>${Math.round(day.main.temp)}°C</h3>
                      <br>
                      <p>${day.weather[0].description}</p>
                      <p>Wind Speed: ${day.wind.speed} m/s</p>
                      <p>Humidity: ${day.main.humidity}%</p>
                  </div>
              `;
            }

            document.getElementById('five-day-forecast').innerHTML = forecastHtml;
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}


function getHourlyForecast(lat, lon) {
    fetch(`${apiBase}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            let hourlyHtml = '';
            for (let i = 0; i < 5; i++) {
                const hour = data.list[i];
                hourlyHtml += `
                  <div class="forecast-hour">
                      <h6>${new Date(hour.dt * 1000).toLocaleTimeString()}</h6>
                      <br>
                      <div class="weather-icon"><i class="fas ${getWeatherIcon(hour.weather[0].main)}"></i></div>
                      <br>
                      <h3>${Math.round(hour.main.temp)}°C</h3>
                      <br>
                      <p>${hour.weather[0].description}</p>
                      <p>Humidity: ${hour.main.humidity}%</p>
                      <p>Wind Speed: ${hour.wind.speed} m/s</p>
                  </div>
              `;
            }
            document.getElementById('hourly-forecast').innerHTML = hourlyHtml;
        })
        .catch(error => console.error('Error fetching hourly forecast data:', error));
}

function getWeatherIcon(weather) {
    switch (weather) {
        case 'Clear':
            return 'fa-sun';
        case 'Clouds':
            return 'fa-cloud';
        case 'Rain':
            return 'fa-cloud-showers-heavy';
        case 'Snow':
            return 'fa-snowflake';
        case 'Thunderstorm':
            return 'fa-bolt';
        case 'Drizzle':
            return 'fa-cloud-rain';
        case 'Mist':
        case 'Fog':
        case 'Haze':
            return 'fa-smog';
        default:
            return 'fa-question';
    }
}

// Search and Suggestions
document.getElementById('searchBox').addEventListener('input', function () {
    const query = this.value;
    if (query.length > 2) {
        fetch(`${apiBase}find?q=${query}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                let suggestionsHtml = '';
                data.list.forEach(city => {
                    suggestionsHtml += `<a href="#" class="list-group-item list-group-item-action" onclick="selectCity(${city.coord.lat}, ${city.coord.lon})">${city.name}, ${city.sys.country}</a>`;
                });
                document.getElementById('suggestions').innerHTML = suggestionsHtml;
            })
            .catch(error => console.error('Error fetching city data:', error));
    } else {
        document.getElementById('suggestions').innerHTML = '';
    }
});

document.getElementById('search-box').addEventListener('input', function () {
    const query = this.value;
    if (query.length > 2) {
        fetch(`${apiBase}find?q=${query}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                let suggestionsHtml = '';
                data.list.forEach(city => {
                    suggestionsHtml += `<a href="#" class="list-group-item list-group-item-action" onclick="selectCity(${city.coord.lat}, ${city.coord.lon})">${city.name}, ${city.sys.country}</a>`;
                });
                document.getElementById('suggestions-container').innerHTML = suggestionsHtml;
            })
            .catch(error => console.error('Error fetching city data:', error));
    } else {
        document.getElementById('suggestions-container').innerHTML = '';
    }
});

function selectCity(lat, lon) {
    document.getElementById('searchBox').value = '';
    document.getElementById('suggestions').innerHTML = '';
    getWeather(lat, lon);
}

function selectCity(lat, lon) {
    document.getElementById('search-box').value = '';
    document.getElementById('suggestions-container').innerHTML = '';
    getWeather(lat, lon);
}



function toggleSearchbox() {

  const togglebutton = document.getElementById('toggleSearchbar');
  const searchBar = document.getElementById('searchBar');
  const hideSearchbar = document.getElementById('hideSearchbar');

  togglebutton.addEventListener('click', function () {
    searchBar.classList.add('active');
  });

  hideSearchbar.addEventListener('click', function () {
    searchBar.classList.remove('active');
  });

} toggleSearchbox();


function showSearchbox() {
  
  const togglebutton = document.getElementById('mobiletoggleSearchbar');
  const searchBar = document.getElementById('mobilesearchBar');
  const hideSearchbar = document.getElementById('mobilehideSearchbar');

  togglebutton.addEventListener('click', function () {
    searchBar.classList.add('active');
  });

  hideSearchbar.addEventListener('click', function () {
    searchBar.classList.remove('active');
  });

} showSearchbox();