const authorContainer = document.getElementById("author-container");
const newsUrl = `https://newsapi.org/v2/top-headlines?language=en&pageSize=1&apiKey=${config.NEWS_API_KEY}`;

fetch(
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains,ocean"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

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

fetch(newsUrl)
  .then((res) => res.json())
  .then((data) => {
    if (data.articles && data.articles.length > 0) {
      const article = data.articles[0];

      const newsEl = document.getElementById("news");

      newsEl.textContent = `Breaking: ${article.title}`;
    }
  })
  .catch((err) => console.error("News error:", err));

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

navigator.geolocation.getCurrentPosition((position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.WEATHER_API_KEY}`
  )
    .then((res) => {
      if (!res.ok) {
        throw Error("Weather data not available");
      }
      return res.json();
    })
    .then((data) => {
      const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.getElementById("weather").innerHTML = `
                <img src="${iconUrl}" />
                <p class="weather-temp">${Math.round(data.main.temp)}°</p>
                <p class="weather-city">${data.name}</p>
            `;
    })
    .catch((err) => console.error(err));
});
