// CONFIG & GLOBALS
const authorContainer = document.getElementById("author-container");
const weatherEl = document.getElementById("weather");
const newsEl = document.getElementById("news");
const cityInput = document.getElementById("city-input");
const searchInput = document.querySelector("#search-form input");

const newsUrl = `https://newsapi.org/v2/everything?q=technology+OR+science+OR+business&language=en&sortBy=relevancy&pageSize=20&apiKey=${config.NEWS_API_KEY}`;

const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
const modifierKey = isMac ? "Cmd" : "Ctrl";

let is24Hour = localStorage.getItem("is24Hour") !== "false";

// BACKGROUND MODULE
function setIntitialFallback() {
  document.body.style.backgroundImage = `url(./images/background.jpg)`;
  authorContainer.innerHTML = `Picture by: <a href="https://emosqueira.com/" target="_blank" style="color: white; text-decoration: underline;">Eduardo Mosqueira Rey</a>`;
}

function updateBackgroundUI(data) {
  const imgUrl = data.urls.full;
  const tempImg = new Image();
  tempImg.src = imgUrl;
  tempImg.onload = () => {
    document.body.style.backgroundImage = `url(${imgUrl})`;
    authorContainer.innerHTML = `Picture by: ${data.user.name}`;
  };
}

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
      .catch((err) => console.error("Unsplash fetch failed", err));
  }
}

// NEWS MODULE
function displayNews(articles) {
  const randomIndex = Math.floor(Math.random() * articles.length);
  const article = articles[randomIndex];
  const sourceName = article.source.name ? ` [${article.source.name}]` : "";

  newsEl.textContent = `Breaking: ${article.title}${sourceName}`;
  newsEl.title = `Click to read article | Click ↺ to shuffle`;
  newsEl.dataset.url = article.url;
  newsEl.setAttribute("data-key", modifierKey);
  newsEl.style.cursor = "pointer";
}

function getNews(forceRefresh = false) {
  const cachedNews = localStorage.getItem("cachedNews");
  const cacheTime = localStorage.getItem("newsCacheTime");
  const now = Date.now();
  const expiry = 30 * 60 * 1000;

  if (!forceRefresh && cachedNews && cacheTime && now - cacheTime < expiry) {
    displayNews(JSON.parse(cachedNews));
  } else {
    newsEl.textContent = "Fetching news...";
    fetch(newsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.articles?.length > 0) {
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

// WEATHER & GEOLOCATION MODULE
function renderWeather(data) {
  const iconCode = data.weather[0].icon;
  const description = data.weather[0].description;
  const iconUrl = `./images/weather_icons/${iconCode}.png`;

  const statusEl = document.getElementById("location-status");
  const resetBtn = document.getElementById("reset-location");
  const isSavedCity = localStorage.getItem("userCity");

  if (statusEl) {
    statusEl.textContent = `Currently showing weather for ${data.name}`;
  }
  //If manual city
  if (resetBtn) {
    if (isSavedCity) {
      resetBtn.classList.remove("hidden");
    } else {
      resetBtn.classList.add("hidden");
    }
  }

  weatherEl.innerHTML = `
        <img src="${iconUrl}" alt="${description}" />
        <div class="weather-info">
            <span class="weather-temp">${Math.round(data.main.temp)}°</span>
            <span class="weather-desc">${description}</span>
            <span class="weather-city">${data.name}</span>
        </div>
    `;
}

function fetchWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.WEATHER_API_KEY}`,
  )
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("cachedWeather", JSON.stringify(data));
      localStorage.setItem("weatherCacheTime", Date.now());
      renderWeather(data);
    });
}

function fetchWeatherByCity(cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${config.WEATHER_API_KEY}`,
  )
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("userCity", cityName);
      localStorage.setItem("cachedWeather", JSON.stringify(data));
      localStorage.setItem("weatherCacheTime", Date.now());
      renderWeather(data);
      document.getElementById("location-input-group").classList.add("hidden");
      cityInput.value = "";
    })
    .catch((err) => alert(err.message));
}

// TIME & GREETING MODULE
function updateTime() {
  const date = new Date();
  const hour = date.getHours();
  const greetingEl = document.getElementById("greeting");
  const timeBtn = document.getElementById("time-format-btn");

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !is24Hour,
  };

  let timeString = date.toLocaleTimeString([], options);

  const timeDisplay = document.querySelector(".time");
  if (is24Hour) {
    timeDisplay.innerHTML = `${timeString} <span class="time-suffix">H</span>`;
  } else {
    timeDisplay.textContent = timeString;
  }

  if (timeBtn) timeBtn.textContent = is24Hour ? "24h" : "12h";

  if (hour < 12) greetingEl.textContent = "Good morning!";
  else if (hour < 18) greetingEl.textContent = "Good afternoon!";
  else greetingEl.textContent = "Good evening!";
}

// EVENT LISTENERS

//refresh background
document
  .getElementById("refresh-bg")
  .addEventListener("click", () => getBackground(true));

//click the news
newsEl.addEventListener("click", (e) => {
  const url = e.currentTarget.dataset.url;
  if (url) window.open(url, "_blank");
});

//refresh news
document.getElementById("refresh-news").addEventListener("click", (e) => {
  e.stopPropagation();
  getNews(true);
});

//edit location

document.getElementById("edit-location-btn").addEventListener("click", () => {
  document.getElementById("location-input-group").classList.toggle("hidden");
});

//city manually
document.getElementById("submit-city").addEventListener("click", () => {
  const city = cityInput.value;
  if (city) fetchWeatherByCity(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchWeatherByCity(e.target.value);
});

//reset location
document.getElementById("reset-location").addEventListener("click", () => {
  localStorage.removeItem("userCity");
  // Reload the page to trigger the original geolocation logic
  location.reload();
});

//Time format
document.getElementById("time-format-btn").addEventListener("click", () => {
  is24Hour = !is24Hour;
  localStorage.setItem("is24Hour", is24Hour);
  updateTime();
});

// Toggle Settings Menu
document.getElementById("settings-toggle-btn").addEventListener("click", () => {
  const menu = document.getElementById("settings-menu");
  menu.classList.toggle("hidden");
});

// Close menu if you click anywhere else on the screen
document.addEventListener("click", (e) => {
  const menu = document.getElementById("settings-menu");
  const btn = document.getElementById("settings-toggle-btn");

  const locationInputGroup = document.getElementById("location-input-group");
  const editLocationBtn = document.getElementById("edit-location-btn");

  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.add("hidden");
  }

  // Logic for Location Input Group
  // Close it only if it's currently open and the user clicks outside
  if (
    !locationInputGroup.classList.contains("hidden") &&
    !locationInputGroup.contains(e.target) &&
    !editLocationBtn.contains(e.target)
  ) {
    locationInputGroup.classList.add("hidden");
  }
});

//Hit Est key yo close any open UI element

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("settings-menu").classList.add("hidden");
    document.getElementById("location-input-group").classList.add("hidden");
  }
});

// INITIALIZATION
setIntitialFallback();
getBackground();
getNews();
updateTime();
setInterval(updateTime, 1000);

const savedCity = localStorage.getItem("userCity");

if (searchInput) searchInput.focus();

if (savedCity) {
  // If user manually set a city before, use it
  console.log("Loading weather for saved city:", savedCity);
  fetchWeatherByCity(savedCity);
} else {
  // If no saved city, try to find them automatically
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
    (err) => fetchWeather(51.5074, -0.1278), // Default to London
    { timeout: 10000 },
  );
}
