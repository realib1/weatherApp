export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const formatDate = (dateString) => {
  const options = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const localDateStr = dateString.includes("T") ? dateString : `${dateString}T00:00:00`
  return new Intl.DateTimeFormat("en-US", options).format(new Date(localDateStr));
};

export const formatDayName = (dateString) => {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' });
};

export const convertTemp = (value, unit) => {
  if (unit === "celsius") {
    return Math.round(value);
  }

  return Math.round((value * 9) / 5 + 32);
};

export const convertWind = (value, unit) => {
  if (unit === "kmh") {
    return Math.round(value);
  }

  return Math.round(value * 0.621371);
};

export const convertPrecipitation = (value, unit) => {
    if(unit === 'millimeters') {
        return Math.round(value);
    }

    return Math.round(value * 0.0393701)
}

export const weatherIcons = {
  // Clear / Clouds
  0: "/assets/images/icon-sunny.webp",
  1: "/assets/images/icon-partly-cloudy.webp",
  2: "/assets/images/icon-partly-cloudy.webp",
  3: "/assets/images/icon-overcast.webp",

  // Fog
  45: "/assets/images/icon-overcast.webp",
  48: "/assets/images/icon-overcast.webp",

  // Drizzle
  51: "/assets/images/icon-rain.webp",
  53: "/assets/images/icon-rain.webp",
  55: "/assets/images/icon-rain.webp",

  // Freezing drizzle
  56: "/assets/images/icon-rain.webp",
  57: "/assets/images/icon-rain.webp",

  // Rain
  61: "/assets/images/icon-rain.webp",
  63: "/assets/images/icon-rain.webp",
  65: "/assets/images/icon-storm.webp",

  // Freezing rain
  66: "/assets/images/icon-rain.webp",
  67: "/assets/images/icon-storm.webp",

  // Snow
  71: "/assets/images/icon-snow.webp",
  73: "/assets/images/icon-snow.webp",
  75: "/assets/images/icon-snow.webp",
  77: "/assets/images/icon-snow.webp",

  // Rain showers
  80: "/assets/images/icon-rain.webp",
  81: "/assets/images/icon-rain.webp",
  82: "/assets/images/icon-storm.webp",

  // Snow showers
  85: "/assets/images/icon-snow.webp",
  86: "/assets/images/icon-snow.webp",

  // Thunderstorm
  95: "/assets/images/icon-storm.webp",
  96: "/assets/images/icon-storm.webp",
  99: "/assets/images/icon-storm.webp",
};
export const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",

  45: "Fog",
  48: "Depositing rime fog",

  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",

  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",

  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",

  66: "Light freezing rain",
  67: "Heavy freezing rain",

  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",

  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",

  85: "Slight snow showers",
  86: "Heavy snow showers",

  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export const getWeatherDescription = (code) => {
  return weatherDescriptions[code] || "Unknown weather condition";
};

export const getWeatherIcons = (code) => {
  return weatherIcons[code] || "/assets/images/icon-sunny.webp";
}