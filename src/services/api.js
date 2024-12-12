export const fetchQuote = async () => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    return `"${data.content}" - ${data.author}`;
  } catch (error) {
    return "Failed to fetch quote. Please try again.";
  }
};

export const fetchJoke = async () => {
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Programming?safe-mode');
    const data = await response.json();
    return data.type === 'twopart' 
      ? `${data.setup}\n${data.delivery}`
      : data.joke;
  } catch (error) {
    return "Failed to fetch joke. Please try again.";
  }
};

export const fetchAnime = async () => {
  try {
    const response = await fetch('https://api.jikan.moe/v4/random/anime');
    const data = await response.json();
    return {
      title: data.data.title,
      rating: data.data.score,
      synopsis: data.data.synopsis
    };
  } catch (error) {
    return null;
  }
};

export const fetchFact = async () => {
  try {
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    const data = await response.json();
    return data.value;
  } catch (error) {
    return "Failed to fetch fact. Please try again.";
  }
};

export const fetchWeather = async (city) => {
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    if (data.cod === 200) {
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        city: data.name,
        country: data.sys.country
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}; 