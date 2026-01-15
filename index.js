const authorContainer = document.getElementById("author-container");
const weatherEl = document.getElementById("weather");
const newsEl = document.getElementById("news");

const newsUrl = `https://newsapi.org/v2/everything?q=technology+OR+science+OR+business&language=en&sortBy=relevancy&pageSize=20&apiKey=${config.NEWS_API_KEY}`;

//Backgraund and author
fetch(
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains,ocean"
)
  .then((response) => response.json())
  .then((data) => {
    //Background image
    document.body.style.backgroundImage = `url(${data.urls.full})`;

    //Author's name
    authorContainer.textContent = `Picture by: ${data.user.name}`;
  })
  .catch((error) => {
    console.error("Something went wrong: ", error);
    document.body.style.backgroundImage = `url(https://wallpapercave.com/wp/wp5252093.jpg)`;
    authorContainer.textContent = `Picture by caverman`;
  });

//News

function getNews() {
  const newsEl = document.getElementById("news");
  newsEl.textContent = "Fetching news...";

  fetch(newsUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.articles && data.articles.length > 0) {
        // Pick a random article instead of always the first one [0]

        const randomIndex = Math.floor(Math.random() * data.articles.length);
        const article = data.articles[randomIndex];

        const sourceName = article.source.name
          ? ` [${article.source.name}]`
          : "";
        newsEl.textContent = `Breaking: ${article.title}${sourceName}`;
      }
    })
    .catch((err) => {
      console.error("News error:", err);
      newsEl.textContent = "News currently unavailable";
    });
}

getNews();

document.getElementById("news").addEventListener("click", getNews);

//Time

function updateTime() {
  const date = new Date();
  document.querySelector(".time").textContent = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
setInterval(updateTime, 1000);
updateTime();

//Geolocation

weatherEl.textContent = "Loading weather...";

// Geolocation with Fallback
weatherEl.textContent = "Loading weather...";

navigator.geolocation.getCurrentPosition(
  (position) => {
    // Success: Use user's real location
    const { latitude, longitude } = position.coords;
    fetchWeather(latitude, longitude);
  },
  (err) => {
    console.warn("Geolocation failed, using default location.");

    // DEFAULT COORDINATES
    const defaultLat = 51.5074;
    const defaultLon = -0.1278;

    fetchWeather(defaultLat, defaultLon);
  },
  { timeout: 10000 }
);

function fetchWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.WEATHER_API_KEY}`
  )
    .then((res) => {
      if (!res.ok) throw Error("Weather data not available");
      return res.json();
    })
    .then((data) => {
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherEl.innerHTML = `
                <img src="${iconUrl}" />
                <span class="weather-temp">${Math.round(data.main.temp)}°</span>
                <span class="weather-city">${data.name}</span>
            `;
    })
    .catch((err) => {
      console.error(err);
      weatherEl.textContent = "Weather unavailable";
    });
}
