console.log("SCRIPT LOADED");
let currentPage = 1;


const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";
const PLACEHOLDER_IMG = "https://via.placeholder.com/200x300?text=No+Image";
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
let startY = 0;
let isPulling = false;

document.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
});

document.addEventListener("touchmove", e => {
  const currentY = e.touches[0].clientY;

  if (window.scrollY === 0 && currentY - startY > 80) {
    isPulling = true;
    document.getElementById("pullIndicator").style.display = "block";
  }
});

document.addEventListener("touchend", () => {
  if (isPulling) {
    refreshMovies();   // uses your existing function
    isPulling = false;
    document.getElementById("pullIndicator").style.display = "none";
  }
});

function fetchByCategory(genreId) {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`)
    .then(res => res.json())
    .then(data => {
      displayMovies(data.results);
    })
    .catch(err => console.error(err));
}


function fetchPopular() {
  console.log("Fetching popular movies, page:", currentPage);

  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${currentPage}`)
    .then(res => res.json())
    .then(data => {
      if (!data.results) {
        console.error("No results", data);
        return;
      }
      displayMovies(data.results);
    })
    .catch(err => console.error(err));
}


function refreshMovies() {
  currentPage = currentPage === 1 ? 2 : 1;
  fetchPopular();
}

function displayMovies(movies) {
  const movieContainer = document.getElementById("movies");
  movieContainer.innerHTML = "";

  movies.forEach(movie => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");
    movieDiv.style.width = "200px";
    movieDiv.style.cursor = "pointer";
    movieDiv.onclick = () => {
  console.log("Clicked movie:", movie.id);
  showMovieDetails(movie.id);
};
    const poster = movie.poster_path
      ? IMAGE_BASE_URL + movie.poster_path
      : PLACEHOLDER_IMG;

    movieDiv.innerHTML = `
      <img src="${poster}" style="width:100%">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
    `;

    movieContainer.appendChild(movieDiv);
  });
}

function searchMovies() {
  const query = document.getElementById("search").value;

  if (query.length < 2) return;

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
    .then(res => res.json())
    .then(data => {
      displayMovies(data.results);
    });
}
function showMovieDetails(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(movie => {
      const detailsDiv = document.getElementById("movieDetails");
      detailsDiv.style.display = "block";

      detailsDiv.innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Rating:</strong> ⭐ ${movie.vote_average}</p>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p>${movie.overview}</p>
        <button onclick="closeDetails()">Close</button>
      `;
      detailsDiv.scrollIntoView({ behavior: "smooth" });
    });
}

function closeDetails() {
  document.getElementById("movieDetails").style.display = "none";
}
function showSettings() {
  document.getElementById("movies").style.display = "none";
  document.getElementById("categories").style.display = "none";
  document.getElementById("movieDetails").style.display = "none";
  document.getElementById("settingsPage").style.display = "block";
}

function showHome() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("settingsPage").style.display = "none";

  document.getElementById("app").style.display = "block";
  document.getElementById("movies").style.display = "flex";
  document.getElementById("categories").style.display = "block";
  document.getElementById("movieDetails").style.display = "none";

  fetchPopular();
}


function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user && pass) {
    localStorage.setItem("loggedIn", "true");
    showHome();
    document.getElementById("loginPage").style.display = "none";
  }
}

function showLogin() {
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("app").style.display = "none";
  document.getElementById("settingsPage").style.display = "none";
}



function logout() {
  localStorage.removeItem("loggedIn");
  showLogin();
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}
if (localStorage.getItem("loggedIn")) {
  showHome();
} else {
  showLogin();
}

