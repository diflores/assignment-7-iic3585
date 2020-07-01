import axios from "axios";
import { parseResults } from "../utils";
import { Rating } from './stars'

window.customElements.define("stars-rating", Rating);

let filterValues = {
  genre: "",
  year: "",
  certification: ""
};

const appendMovies = movies => {
  const moviesList = document.getElementById("movies");
  const fragment = document.getElementById("movie-template");
  moviesList.innerHTML = "";

  movies.forEach(movie => {
    const instance = document.importNode(fragment.content, true);
    instance.querySelector("#movie-image").setAttribute("src", movie.posterURL);
    instance.querySelector("#movie-title").innerHTML = movie.title;
    instance.querySelector("#movie-plot").innerHTML = movie.plot;
    const ratings = document.createElement("stars-rating");
    instance.querySelector("#stars-container").appendChild(ratings);
    moviesList.appendChild(instance);
  });
};

const getMovies = () => {
  const params = {
    api_key: "6ef8f15c4d654724af2bc133947a5693",
    sort_by: "popularity.desc"
  };
  if (filterValues.genre) {
    params.with_genres = filterValues.genre;
  }
  if (filterValues.year) {
    params.year = filterValues.year;
  }
  if (filterValues.certification) {
    params.certification_country = "US";
    params.certification = filterValues.certification;
  }
  axios({
    url: "https://api.themoviedb.org/3/discover/movie",
    params,
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    method: "GET"
  })
    .then(response => {
      const movies = parseResults(response);
      appendMovies(movies);
    })
    .catch(error => console.log(error));
};

const appendFilter = (options, key) => {
  const filtersList = document.getElementById("filters");
  const fragment = document.getElementById("filter-template");
  const filterInstance = document.importNode(fragment.content, true);
  const filterSelect = filterInstance.querySelector("#filter-select");

  options.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", option.value);
    optionElement.setAttribute("id", "filter-option");
    optionElement.innerHTML = option.text;
    filterSelect.appendChild(optionElement);
  });

  filterSelect.addEventListener("change", event => {
    filterValues[key] = filterSelect.options[filterSelect.selectedIndex].value;
    getMovies();
  });
  filtersList.append(filterInstance);
};

// agregar filtro por género
axios({
  url: "https://api.themoviedb.org/3/genre/movie/list",
  params: {
    api_key: "6ef8f15c4d654724af2bc133947a5693"
  },
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  },
  method: "GET"
})
  .then(response => {
    const genres = response.data.genres.map(genre => ({
      text: genre.name,
      value: genre.id
    }));
    const genresWithEmptyOption = [{ text: "All genres", value: "" }].concat(
      genres
    );
    appendFilter(genresWithEmptyOption, "genre");
  })
  .catch(error => console.log(error));

// agregar filtro por año
const yearOptions = [...Array(10)].map((_, index) => ({
  value: 2020 - index,
  text: 2020 - index
}));
const yearsWithEmptyOption = [{ text: "All years", value: "" }].concat(
  yearOptions
);
appendFilter(yearsWithEmptyOption, "year");

// agregar filtro por certificación
axios({
  url: "https://api.themoviedb.org/3/certification/movie/list",
  params: {
    api_key: "6ef8f15c4d654724af2bc133947a5693"
  },
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  },
  method: "GET"
})
  .then(response => {
    const certifications = response.data.certifications.US.map(
      certification => ({
        text: certification.certification,
        value: certification.certification
      })
    );
    const certificationsWithEmptyOption = [
      { text: "All certifications", value: "" }
    ].concat(certifications);
    appendFilter(certificationsWithEmptyOption, "certification");
  })
  .catch(error => console.log(error));

// obtener películas iniciales
getMovies();




