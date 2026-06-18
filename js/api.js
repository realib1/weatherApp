export const searchLocation = async (query) => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    throw new Error(`Error fetching location data: ${err.message}`);
  }
};

export const fetchWeather = async (lat, lng) => {
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      current:
        "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,is_day",
      hourly: "temperature_2m,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      timezone: "auto",
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Error fetching weather data: ${err.message}`);
  }
};
