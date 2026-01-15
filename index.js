const authorContainer = document.getElementById("author-container");
const weatherEl = document.getElementById("weather");
const newsEl = document.getElementById("news");

const newsUrl = `https://newsapi.org/v2/everything?q=technology+OR+science+OR+business&language=en&sortBy=relevancy&pageSize=20&apiKey=${config.NEWS_API_KEY}`;

//Backgraund and author

const cachedBg = localStorage.getItem("cachedBg");
const bgCacheTime = localStorage.getItem("bgCacheTime");
const now = Date.now();

// Cache background for 2 hours
if (cachedBg && bgCacheTime && now - bgCacheTime < 2 * 60 * 60 * 1000) {
  const data = JSON.parse(cachedBg);
  document.body.style.backgroundImage = `url(${data.urls.full})`;
  authorContainer.textContent = `Picture by: ${data.user.name}`;
} else {
  fetch(
    "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains,ocean"
  )
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("cachedBg", JSON.stringify(data));
      localStorage.setItem("bgCacheTime", now);
      document.body.style.backgroundImage = `url(${data.urls.full})`;
      authorContainer.textContent = `Picture by: ${data.user.name}`;
    })
    .catch((err) => {
      document.body.style.backgroundImage = `url(https://wallpapercave.com/wp/wp5252093.jpg)`;
      authorContainer.textContent = `Picture by caverman`;
    });
}

//News

function getNews() {
  const newsEl = document.getElementById("news");
  const cachedNews = localStorage.getItem("cachedNews");
  const cacheTime = localStorage.getItem("newsCacheTime");
  const now = Date.now();

  const expiry = 30 * 60 * 1000;

  if (cachedNews && cacheTime && now - cacheTime < expiry) {
    console.log("Loading news from cache");
    displayNews(JSON.parse(cachedNews));
  } else {
    console.log("Fetching new news from API");
    fetch(newsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          localStorage.setItem("cachedNews", JSON.stringify(data.articles));
          localStorage.setItem("newsCacheTime", now);
          displayNews(data.articles);
        }
      })
      .catch((err) => {
        newsEl.textContent = "News currently unavailable";
      });
  }
}

//UI part
function displayNews(articles) {
  const randomIndex = Math.floor(Math.random() * articles.length);
  const article = articles[randomIndex];
  const sourceName = article.source.name ? ` [${article.source.name}]` : "";
  document.getElementById(
    "news"
  ).textContent = `Breaking: ${article.title}${sourceName}`;
}

getNews();

document.getElementById("news").addEventListener("click", getNews);

//Greeting

function getGreeting() {
  const hour = new Date().getHours();
  const greetingEl = document.getElementById("greeting");

  if (hour < 12) {
    greetingEl.textContent = "Good morning!";
  } else if (hour < 18) {
    greetingEl.textContent = "Good afternoon!";
  } else {
    greetingEl.textContent = "Good evening!";
  }
}

//Time

function updateTime() {
  const date = new Date();
  document.querySelector(".time").textContent = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  getGreeting();
}
setInterval(updateTime, 1000);
updateTime();

//Geolocation

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
  const cachedWeather = localStorage.getItem("cachedWeather");
  const weatherCacheTime = localStorage.getItem("weatherCacheTime");
  const now = Date.now();

  if (
    cachedWeather &&
    weatherCacheTime &&
    now - weatherCacheTime < 30 * 60 * 1000
  ) {
    console.log("Loading weather from cache");
    renderWeather(JSON.parse(cachedWeather));
  } else {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.WEATHER_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("cachedWeather", JSON.stringify(data));
        localStorage.setItem("weatherCacheTime", now);
        renderWeather(data);
      });
  }
}

function renderWeather(data) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherEl.innerHTML = `
        <img src="${iconUrl}" />
        <span class="weather-temp">${Math.round(data.main.temp)}°</span>
        <span class="weather-city">${data.name}</span>
    `;
}
