function buildGeocodingUrl(city) {
  return `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city,
  )}&count=1&language=en&format=json`;
}

function buildForecastUrl(location, { days }) {
  const weatherParams = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
    forecast_days: String(days),
  });

  return `https://api.open-meteo.com/v1/forecast?${weatherParams.toString()}`;
}

async function fetchJson(url, errorMessage) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

function formatLocation(location) {
  const parts = [location.name, location.admin1, location.country].filter(
    Boolean,
  );
  return parts.join(", ");
}

function codeToDescription(code) {
  const codeMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Heavy rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
  };

  return codeMap[code] ?? "Unknown";
}

export async function getWeather(city, limits = { days: 7 }) {
  const geoData = await fetchJson(buildGeocodingUrl(city), "Geocoding failed");

  if (!geoData.results?.length) {
    throw new Error(`City not found: ${city}`);
  }

  const location = geoData.results[0];
  const weatherData = await fetchJson(
    buildForecastUrl(location, limits),
    "Weather request failed",
  );

  const currentCode = weatherData.current?.weather_code;
  const currentCondition = codeToDescription(currentCode);

  const daily = (weatherData.daily?.time ?? []).map((date, index) => ({
    date,
    min: weatherData.daily.temperature_2m_min?.[index],
    max: weatherData.daily.temperature_2m_max?.[index],
    precipitationProbabilityMax:
      weatherData.daily.precipitation_probability_max?.[index],
    sunrise: weatherData.daily.sunrise?.[index],
    sunset: weatherData.daily.sunset?.[index],
    weatherCode: weatherData.daily.weather_code?.[index],
    condition: codeToDescription(weatherData.daily.weather_code?.[index]),
  }));

  return {
    location: {
      city: location.name,
      label: formatLocation(location),
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: weatherData.timezone,
    },
    units: weatherData.current_units ?? {},
    current: {
      time: weatherData.current?.time,
      temperature: weatherData.current?.temperature_2m,
      humidity: weatherData.current?.relative_humidity_2m,
      feelsLike: weatherData.current?.apparent_temperature,
      precipitation: weatherData.current?.precipitation,
      windSpeed: weatherData.current?.wind_speed_10m,
      windDirection: weatherData.current?.wind_direction_10m,
      weatherCode: currentCode,
      condition: currentCondition,
    },
    daily,
  };
}
