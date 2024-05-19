
function loadSearchHistory() {
  // Get the cities from local storage
  var cities = JSON.parse(localStorage.getItem('cities')) || [];

  // Get the search-history div
  var searchHistoryDiv = document.getElementById('search-history');

  // Clear the search-history div
  searchHistoryDiv.innerHTML = '<h2>Search History</h2>';

  // Add each city to the search-history div
  cities.forEach(city => {
      var cityElement = document.createElement('p');
      cityElement.textContent = city;
      cityElement.addEventListener('click', function() {
          document.getElementById('search-input').value = city;
          getWeatherForecast(new Event('submit'));
      });
      searchHistoryDiv.appendChild(cityElement);
  });
}

function formatDate(dateString) {
  var date = new Date(dateString);
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

  return mm + '/' + dd + '/' + yyyy;
}

function getWeatherForecast(event) {
  event.preventDefault();
  var cityName = document.getElementById('search-input').value;
  var apiKey = '3327935e8d988dde8910d3b7a33aaa5e';
  var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(requestUrl)
      .then(response => response.json())
      .then(data => {
          if (data.city) {
              // Save the city in local storage
              var cities = JSON.parse(localStorage.getItem('cities')) || [];
              if (!cities.includes(cityName)) {
                  cities.push(cityName);
                  localStorage.setItem('cities', JSON.stringify(cities));
              }

              // Load the search history
              loadSearchHistory();

              // Get the div elements
              var currentWeatherDiv = document.getElementById('current-weather');
              var forecastDiv = document.getElementById('forecast');

              // Clear the div elements
              currentWeatherDiv.innerHTML = '';
              forecastDiv.innerHTML = '';

              // Get the current weather and five-day forecast data
              var currentWeather = data.list[0];
              var fiveDayForecast = data.list.filter((forecast, index) => index % 8 === 0).slice(1, 6);
              // Display the current weather
              currentWeatherDiv.innerHTML = `
                  <h2>Current Weather</h2>
                  <p>Date: ${formatDate(currentWeather.dt_txt)}</p>
                  <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png">
                  <p>Temperature: ${currentWeather.main.temp}°F</p>
                  <p>Wind: ${currentWeather.wind.speed} MPH</p>
                  <p>Humidity: ${currentWeather.main.humidity}%</p>
              `;

              // Display the five-day forecast
              forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
              fiveDayForecast.forEach(forecast => {
                  forecastDiv.innerHTML += `
                      <div>
                          <h3>${formatDate(forecast.dt_txt)}</h3>
                          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png">
                          <p>Temperature: ${forecast.main.temp}°F</p>
                          <p>Wind: ${forecast.wind.speed} MPH</p>
                          <p>Humidity: ${forecast.main.humidity}%</p>
                      </div>
                  `;
              });
          } else {
              console.log('City not found');
          }
      })
      .catch(error => console.error('Error:', error));
}

document.getElementById('search-form').addEventListener('submit', getWeatherForecast);
// Load the search history when the page loads
window.addEventListener('load', loadSearchHistory);
