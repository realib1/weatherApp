import { searchLocation, fetchWeather } from "./api.js";
import { state } from "./state.js";
import { debounce, formatDayName } from "./utils.js";
import {
  updateWeatherCard,
  updateMetrics,
  updateDailyForecast,
  updateHourlyDropdown,
  updateHourlyForecast,
  showSuggestions,
  clearSuggestions,
  showState,
} from "./ui.js";

const navUnits = document.querySelector(".nav__units");
const navUnitsDropdown = document.querySelector(".nav__units-dropdown");
const switchBtn = document.querySelector(".nav__units-switch");
const navUnitsBtn = document.querySelector(".nav__units-btn");
const searchInput = document.querySelector(".search__input");
const searchBtn = document.querySelector(".search__btn");
const searchSuggestions = document.querySelector(".search__suggestions");
const hourlyDropdownBtn = document.querySelector(
  ".forecast-grid__hourly-dropdown-btn",
);
const hourlyDropdown = document.querySelector(
  ".forecast-grid__hourly-dropdown",
);
const hourlyDropdownDash = document.querySelector(
  ".forecast-grid__hourly-dropdown-dash",
);

const rerender = () => {
  if (!state.location || !state.weatherData) return;

  updateWeatherCard(state.location, state.weatherData, state.units.temperature);
  updateMetrics(state.weatherData, state.units);
  updateDailyForecast(state.weatherData, state.units);
  updateHourlyDropdown(state.weatherData); 
  updateHourlyForecast(state.weatherData, state.units, state.selectedDay);
};

const syncUnitRadios = () => {
  const { temperature, wind, precipitation } = state.units;

  const tempRadio = document.querySelector(
    `input[name="temperature"][value="${temperature}"]`
  );
  if (tempRadio) tempRadio.checked = true;

  const windRadio = document.querySelector(
    `input[name="wind-speed"][value="${wind}"]`
  );
  if (windRadio) windRadio.checked = true;

  const precRadio = document.querySelector(
    `input[name="precipitation"][value="${precipitation}"]`
  );
  if (precRadio) precRadio.checked = true;
};

// Load weather data for display in UI
const loadWeather = (location, data) => {
  state.location = location;
  state.weatherData = data;
  state.selectedDay = 0;
  rerender();
  hourlyDropdownDash.textContent = formatDayName(
    data.daily.time[state.selectedDay],
  );
  showState("loaded");
};

// Handle search input with debounce
const handleSearch = async (query) => {
  try {
    const results = await searchLocation(query);
    state.searchResults = results;

    if (results.length > 0) {
      showSuggestions(results);
    } else {
      showState("no-results");
      clearSuggestions();
    }
  } catch (err) {
    console.error("Something went wrong", err);
  }
};

// Handle search selection for location
const handleLocationSelection = async (location) => {
  state.location = location;
  showState("loading");
  try {
    const weatherData = await fetchWeather(
      location.latitude,
      location.longitude,
    );
    loadWeather(location, weatherData);
    clearSuggestions();
    searchInput.value = "";
  } catch (err) {
    showState("error");
    console.error("Something went wrong", err);
  }
};

// Event Listeners
const debounceSearch = debounce(handleSearch, 300);
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length >= 3) {
    debounceSearch(query);
  } else {
    clearSuggestions();
    searchInput.setAttribute("aria-expanded", "false");
  }
});

searchBtn.addEventListener("click", () => handleSearch(searchInput.value));
searchSuggestions.addEventListener("click", (e) => {
  const suggestionItem = e.target.closest(".search__suggestion-item");
  if (suggestionItem) {
    const index = suggestionItem.dataset.index;
    const location = state.searchResults[index];
    handleLocationSelection(location);
  }
});

hourlyDropdownBtn.addEventListener("click", () => {
  hourlyDropdownBtn.addEventListener("click", () => {
    const isOpen = hourlyDropdown.classList.toggle(
      "forecast-grid__hourly-dropdown--active",
    );

    hourlyDropdownBtn.setAttribute("aria-expanded", String(isOpen));
  });
});

hourlyDropdown.addEventListener("change", (e) => {
  const selectedIndex = +e.target.value;
  state.selectedDay = selectedIndex;
  hourlyDropdownDash.textContent = formatDayName(
    state.weatherData.daily.time[selectedIndex],
  );
  updateHourlyForecast(state.weatherData, state.units, state.selectedDay);
  hourlyDropdown.classList.remove("forecast-grid__hourly-dropdown--active");
});

// Geolocation function for current/initial location
const initGeolocation = () => {
  const navigatorLocation = navigator.geolocation;
  if (navigatorLocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        showState("loading");
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const weatherData = await fetchWeather(lat, lng);
        loadWeather({ name: "Current Location", country: "" }, weatherData);
      },
      (err) => {
        console.error("Geolocation failed", err);
      },
    );
  }
};

initGeolocation();
// Nav units dropdown
navUnitsBtn.addEventListener("click", () => {
  const isOpen = navUnitsDropdown.classList.toggle(
    "nav__units-dropdown--active",
  );

  navUnitsBtn.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (e) => {
  if (!navUnits.contains(e.target)) {
    navUnitsDropdown.classList.remove("nav__units-dropdown--active");
  }
});

// Update function for dropdown metrics
navUnitsDropdown.addEventListener("change", (e) => {
  const { name, value } = e.target;
  if (!["temperature", "wind-speed", "precipitation"].includes(name)) return;

  if (name === "temperature") state.units.temperature = value;
  if (name === "wind-speed") state.units.wind = value;
  if (name === "precipitation") state.units.precipitation = value;

  syncUnitRadios()
  rerender();
});

// Switch Imperial
switchBtn.addEventListener("click", () => {
  const toImperial = state.units.temperature === "celsius";

  state.units.temperature = toImperial ? "fahrenheit" : "celsius";
  state.units.wind = toImperial ? "mph" : "kmh";
  state.units.precipitation = toImperial ? "inches" : "millimeters";

  switchBtn.textContent = toImperial
    ? "Switch to Metric"
    : "Switch to Imperial";

  syncUnitRadios()
  rerender();
});
