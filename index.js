const autorContainer = document.getElementById("author-container");

fetch(
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains,ocean"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    //Background image
    document.body.style.backgroundImage = `url(${data.urls.full})`;

    //Autor's name
    autorContainer.textContent = `By: ${data.user.name}`;
  })
  .catch((error) => {
    console.error("Something went wrong: ", error);
  });
