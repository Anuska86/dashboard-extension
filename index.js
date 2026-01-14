fetch(
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains,ocean"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    document.body.style.backgroundImage = `url(${data.urls.full})`;
  })
  .catch((error) => {
    console.error("Something went wrong: ", error);
  });
