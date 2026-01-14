const authorContainer = document.getElementById("author-container");
const newsUrl = `https://newsapi.org/v2/top-headlines?language=en&pageSize=1&apiKey=${newsKey}`;

fetch(
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains,ocean"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    //Background image
    document.body.style.backgroundImage = `url(${data.urls.full})`;

    //Autor's name
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

      const newsEl = document.querySelector(".top-page p:first-child");

      newsEl.textContent = `Breaking: ${article.title}`;
    }
  })
  .catch((err) => console.error("News error:", err));
