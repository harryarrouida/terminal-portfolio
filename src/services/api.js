import md5 from 'md5';

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

export const fetchRandomCountry = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    const randomCountry = data[Math.floor(Math.random() * data.length)];
    return {
      name: randomCountry.name.common,
      capital: randomCountry.capital?.[0] || 'N/A',
      population: randomCountry.population,
      region: randomCountry.region,
      flag: randomCountry.flags.svg,
      hints: [
        `Region: ${randomCountry.region}`,
        `Population: ${(randomCountry.population / 1000000).toFixed(1)} million people`,
        `Capital: ${randomCountry.capital?.[0] || 'N/A'}`,
        `Subregion: ${randomCountry.subregion || 'N/A'}`,
        randomCountry.languages ? `Languages: ${Object.values(randomCountry.languages).join(', ')}` : 'No language data available'
      ]
    };
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
};

export const fetchNews = async (category = 'general') => {
  const API_KEY = process.env.REACT_APP_NEWSAPI_API_KEY;
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    if (data.status === 'ok' && data.articles) {
      return data.articles.slice(0, 5).map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: new Date(article.publishedAt).toLocaleDateString()
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
};

export const fetchHPCharacter = async () => {
  try {
    const response = await fetch('https://hp-api.onrender.com/api/characters');
    const data = await response.json();
    // Filter out characters without images and with too little information
    const validCharacters = data.filter(char => 
      char.image && char.house && char.wand.wood && char.patronus
    );
    const character = validCharacters[Math.floor(Math.random() * validCharacters.length)];
    
    return {
      name: character.name,
      image: character.image,
      hints: [
        `House: ${character.house}`,
        `Wand core: ${character.wand.core}`,
        `Wand wood: ${character.wand.wood}`,
        `Patronus: ${character.patronus}`,
        `Gender: ${character.gender}`,
        `Species: ${character.species}`,
        character.dateOfBirth ? `Born: ${character.dateOfBirth}` : 'Birth date unknown',
        `Ancestry: ${character.ancestry || 'unknown'}`,
      ],
      details: {
        house: character.house,
        patronus: character.patronus,
        ancestry: character.ancestry,
        wand: `${character.wand.wood} wood with ${character.wand.core} core`,
      }
    };
  } catch (error) {
    console.error('Error fetching HP character:', error);
    return null;
  }
};

export const fetchMarvelCharacter = async () => {
  try {
    const publicKey = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_MARVEL_PRIVATE_KEY;
    const ts = new Date().getTime().toString();
    const hash = md5(ts + privateKey + publicKey);
    
    // Get a list of well-known characters instead of random offset
    const response = await fetch(
      `https://gateway.marvel.com/v1/public/characters?limit=100&nameStartsWith=Spider&apikey=${publicKey}&ts=${ts}&hash=${hash}`
    );
    
    if (!response.ok) {
      console.error('Marvel API response not ok:', await response.text());
      return null;
    }

    const data = await response.json();
    
    if (data.data?.results && data.data.results.length > 0) {
      // Get a random character from the results
      const character = data.data.results[Math.floor(Math.random() * data.data.results.length)];
      
      // Filter out characters with placeholder images
      if (character.thumbnail.path.includes('image_not_available')) {
        return null;
      }

      return {
        name: character.name,
        image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
        hints: [
          `Description: ${character.description || 'No description available'}`,
          `Comics appearances: ${character.comics.available}`,
          `Series appearances: ${character.series.available}`,
          `Stories appearances: ${character.stories.available}`,
          character.comics.items.length > 0 ? 
            `Featured in comic: ${character.comics.items[0].name}` : 'No comic information',
          character.series.items.length > 0 ? 
            `Featured in series: ${character.series.items[0].name}` : 'No series information',
        ],
        details: {
          description: character.description || 'No description available',
          comics: character.comics.available,
          series: character.series.available,
          stories: character.stories.available,
          modified: new Date(character.modified).toLocaleDateString(),
          wiki: character.urls.find(url => url.type === 'wiki')?.url || null,
          comiclink: character.urls.find(url => url.type === 'comiclink')?.url || null,
        }
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Marvel character:', error);
    return null;
  }
};
