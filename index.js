const authorContainer = document.getElementById("author-container");
const weatherEl = document.getElementById("weather");
const newsEl = document.getElementById("news");

const newsUrl = `https://newsapi.org/v2/everything?q=technology+OR+science+OR+business&language=en&sortBy=relevancy&pageSize=20&apiKey=${config.NEWS_API_KEY}`;

const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
const modifierKey = isMac ? "Cmd" : "Ctrl";

//BACKGROUND

//Local background

function setIntitialFallback() {
  document.body.style.backgroundImage = `url(./images/background.jpg)`;
  authorContainer.innerHTML = `Picture by: <a href="https://emosqueira.com/" target="_blank" style="color: white; text-decoration: underline;">Eduardo Mosqueira Rey</a>`;
}

//Fetch from Unsplash or cache

function getBackground(forceRefresh = false) {
  const cachedBg = localStorage.getItem("cachedBg");
  const bgCacheTime = localStorage.getItem("bgCacheTime");
  const now = Date.now();
  const expiry = 2 * 60 * 60 * 1000;

  if (!forceRefresh && cachedBg && bgCacheTime && now - bgCacheTime < expiry) {
    updateBackgroundUI(JSON.parse(cachedBg));
  } else {
    fetch(
      "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains,ocean",
    )
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("cachedBg", JSON.stringify(data));
        localStorage.setItem("bgCacheTime", now);
        updateBackgroundUI(data);
      })
      .catch((err) => {
        console.error("Unsplash fetch failed, keeping local fallback", err);
      });
  }
}

//Load the image first

function updateBackgroundUI(data) {
  const imgUrl = data.urls.full;
  const tempImg = new Image();
  tempImg.src = imgUrl;

  tempImg.onload = () => {
    document.body.style.backgroundImage = `url(${imgUrl})`;
    authorContainer.innerHTML = `Picture by:${data.user.name}`;
  };
}

setIntitialFallback();
getBackground();

document
  .getElementById("refresh-bg")
  .addEventListener("click", () => getBackground(true));

//NEWS

//get the news

function getNews(forceRefresh = false) {
  const newsEl = document.getElementById("news");
  const cachedNews = localStorage.getItem("cachedNews");
  const cacheTime = localStorage.getItem("newsCacheTime");
  const now = Date.now();
  const expiry = 30 * 60 * 1000; // 30 minutes

  if (!forceRefresh && cachedNews && cacheTime && now - cacheTime < expiry) {
    console.log("Shuffling from cached news");
    displayNews(JSON.parse(cachedNews));
  } else {
    console.log("Fetching fresh news from API");
    newsEl.textContent = "Fetching news...";

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
        console.error(err);
      });
  }
}

// Show random article
function displayNews(articles) {
  const randomIndex = Math.floor(Math.random() * articles.length);
  const article = articles[randomIndex];
  const newsEl = document.getElementById("news");

  const sourceName = article.source.name ? ` [${article.source.name}]` : "";

  // Update the UI text
  newsEl.textContent = `Breaking: ${article.title}${sourceName}`;

  // hint on hover
  newsEl.title = `Click to read article | Click ↺ to shuffle`;

  // Save the URL
  newsEl.dataset.url = article.url;

  newsEl.setAttribute("data-key", modifierKey);

  newsEl.style.cursor = "pointer";
}

document.getElementById("news").addEventListener("click", (e) => {
  const url = e.currentTarget.dataset.url;

  // CTRL + CLICK to open link
  if (url) {
    window.open(url, "_blank");
  }
});

document.getElementById("refresh-news").addEventListener("click", (e) => {
  e.stopPropagation();
  getNews(true); // Force fresh API call
});

// Refresh button logic
document.getElementById("refresh-news").addEventListener("click", (e) => {
  e.stopPropagation();
  getNews(true); // Force fresh API call
});

getNews();

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
  { timeout: 10000 },
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
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.WEATHER_API_KEY}`,
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
  const iconCode = data.weather[0].icon;
  const description = data.weather[0].description;
  const iconUrl = `./images/weather_icons/${iconCode}.png`;

  weatherEl.innerHTML = `
        <img src="${iconUrl}" alt="${description}" />
        <div class="weather-info">
            <span class="weather-temp">${Math.round(data.main.temp)}°</span>
            <span class="weather-desc">${description}</span>
            <span class="weather-city">${data.name}</span>
        </div>
    `;
}

/*Search input*/

const searchInput = document.querySelector("#search-form input");
if (searchInput) {
  searchInput.focus();
}
