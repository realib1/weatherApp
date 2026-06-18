import {
  formatDate,
  formatDayName,
  convertTemp,
  convertPrecipitation,
  convertWind,
  getWeatherIcons,
  getWeatherDescription,
} from "./utils.js";

// Search
const searchSuggestions = document.querySelector(".search__suggestions");
const searchInput = document.querySelector(".search__input");
const heroSection = document.querySelector(".hero");

// Weather
const weatherCard = document.querySelector(".weather-card");
const weatherCity = document.querySelector(".weather-card__city");
const weatherDate = document.querySelector(".weather-card__date");
const weatherIcon = document.querySelector(".weather-card__icon");
const weatherTemp = document.querySelector(".weather-card__temp");

// Metrics
const feelsLikeValue = document.querySelector('[data-metric="feels-like"]');
const humidityValue = document.querySelector('[data-metric="humidity"]');
const windValue = document.querySelector('[data-metric="wind"]');
const precipitationValue = document.querySelector(
  '[data-metric="precipitation"]',
);

// Forecast
const forecastGrid = document.querySelector(".forecast-grid");
const dailyList = document.querySelector(".forecast-grid__daily-list");
const hourlyList = document.querySelector(".forecast-grid__hourly-list");
const hourlyDropdown = document.querySelector(
  ".forecast-grid__hourly-dropdown",
);

// States
const states = document.querySelectorAll(".state");
const loadingState = document.querySelector(".weather-card__loading");
const noResultsState = document.querySelector(".state--no-results");
const errorState = document.querySelector(".state--error");

// const icon = getWeatherIcons(codes[index]);

// Update function for weather cards
const updateWeatherCard = (location, data, unit) => {
  const code = data.current.weather_code;
  const icon = getWeatherIcons(code);

  weatherCity.textContent = `${location.name}, ${location.country}`;
  weatherDate.textContent = `${formatDate(data.current.time)}`;
  weatherTemp.textContent = `${convertTemp(data.current.temperature_2m, unit)}°`;
  weatherIcon.src = `${icon}`;
  weatherIcon.alt = getWeatherDescription(code);
};

// Update function for all metrics
const updateMetrics = (data, units) => {
  feelsLikeValue.textContent = `${convertTemp(data.current.apparent_temperature, units.temperature)}°`;
  humidityValue.textContent = `${data.current.relative_humidity_2m}%`;
  windValue.textContent = `${convertWind(data.current.wind_speed_10m, units.wind)}${units.wind === "kmh" ? "km/h" : "mph"}`;
  precipitationValue.textContent = `${convertPrecipitation(data.current.precipitation, units.precipitation)}${units.precipitation === "millimeters" ? "mm" : "in"}`;
};

// Update function for daily forecast
const updateDailyForecast = (data, units) => {
  dailyList.innerHTML = "";
  dailyList.setAttribute("aria-busy", "false");
  data.daily.time.forEach((date, index) => {
    const codes = data.daily.weather_code;
    const icon = getWeatherIcons(codes[index]);
    const dailyItem = document.createElement("div");
    dailyItem.classList.add("forecast-grid__daily-item");
    dailyItem.innerHTML = `
        <p class="forecast-grid__daily-day">${new Date(date).toLocaleDateString("en-US", { weekday: "short" })}</p>
                <img src="${icon}" alt="" aria-hidden="true" class="forecast-grid__daily-icon" />
                <div class="forecast-grid__daily-temp">
                    <p class="forecast-grid__daily-high">${convertTemp(data.daily.temperature_2m_max[index], units.temperature)}°</p>
                    <p class="forecast-grid__daily-low">${convertTemp(data.daily.temperature_2m_min[index], units.temperature)}°</p>
                </div>
        `;
    dailyList.appendChild(dailyItem);
  });
};

// Hourly dropdown
const updateHourlyDropdown = (data) => {
  hourlyDropdown.innerHTML = "";
  data.daily.time.forEach((dateStr, index) => {
    const dayName = formatDayName(dateStr);
    const label = document.createElement("label");
    label.innerHTML = `
    <input type="radio" name="hourly-dropdown" value=${index} ${index === 0 ? "checked" : ""} />
    <span>${dayName}</span>`;

    hourlyDropdown.appendChild(label);
  });
};

// Update function for hourly forecast
const updateHourlyForecast = (data, unit, dayIndex) => {
  const startIndex = dayIndex * 24;
  const endIndex = startIndex + 24;

  const hours = data.hourly.time.slice(startIndex, endIndex);
  const temps = data.hourly.temperature_2m.slice(startIndex, endIndex);
  const codes = data.hourly.weather_code.slice(startIndex, endIndex);
  
  hourlyList.innerHTML = "";
  hourlyList.setAttribute("aria-busy", "false");
  hours.forEach((hour, index) => {
    const icon = getWeatherIcons(codes[index]);
    const hourlyItem = document.createElement("div");
    hourlyItem.classList.add("forecast-grid__hourly-item");
    hourlyItem.innerHTML = `
      <div class="forecast-grid__hourly-left">
      <img class="forecast-grid__hourly-icon" src="${icon}" alt="" aria-hidden="true" />
      <p class="forecast-grid__hourly-time">${new Date(hour).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}</p>
      </div>
      <p class="forecast-grid__hourly-temp">${convertTemp(temps[index], unit.temperature)}°</p>
    `;
    hourlyList.appendChild(hourlyItem);
  });
};

// Show suggestions for search data
const showSuggestions = (results) => {
  searchSuggestions.innerHTML = "";
  if (!results || results.length === 0) {
    searchSuggestions.style.display = "none";
    return;
  }

  results.forEach((result, index) => {
    const resultsBtn = document.createElement("button");
    resultsBtn.classList.add("search__suggestion-item");
    resultsBtn.dataset.index = index;
    resultsBtn.innerHTML = `
      <p class="search__suggestion-name">${result.name}, ${result.country}</p>
      `;
    searchSuggestions.appendChild(resultsBtn);
  });
  searchSuggestions.style.display = "block";
  searchInput.setAttribute("aria-expanded", "true");
};

// Clear Suggestions
const clearSuggestions = () => {
  searchSuggestions.innerHTML = "";
  searchSuggestions.style.display = "none";
  searchInput.setAttribute("aria-expanded", "false");
};

// Show state
const showState = (stateName) => {
  states.forEach((el) => el.classList.remove("state--visible"));
  forecastGrid.style.display = "none";
  heroSection.style.display = "flex";

  if (stateName === "loading") {
    loadingState.style.display = "flex";
    loadingState.removeAttribute("hidden");
    weatherCard.style.display = "none";
  }

  if (stateName === "loaded") {
    forecastGrid.style.display = "grid";
    loadingState.style.display = "none";
    loadingState.setAttribute("hidden", "");
    weatherCard.style.display = "flex";
  }

  if (stateName === "no-results")
    noResultsState.classList.add("state--visible");

  if (stateName === "error") {
    heroSection.style.display = "none";
    errorState.classList.add("state--visible");
  }
};

export {
  updateWeatherCard,
  updateMetrics,
  updateDailyForecast,
  updateHourlyDropdown,
  updateHourlyForecast,
  showSuggestions,
  clearSuggestions,
  showState,
};
