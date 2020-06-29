import axios from 'axios';
import { parseResults } from "../utils";
// import dotenv from 'dotenv'
// console.log(dotenv.config())
// dotenv.config()
// console.log(process.env.MOVIE_API_BASE_URL)

const appendMovies = (movies) => {
  const moviesList = document.getElementById('movies');
  const fragment = document.getElementById('movie-template');
  moviesList.innerHTML = '';

  movies.forEach((movie) => {
    const instance = document.importNode(fragment.content, true);
    instance.querySelector('#movie-image').setAttribute("src", movie.posterURL);
    instance.querySelector('#movie-title').innerHTML = movie.title;
    instance.querySelector('#movie-plot').innerHTML = movie.plot;
    moviesList.appendChild(instance);
  });
};

let genreSelected = '';

const getMovies = () => {
  const params = {
    api_key: '6ef8f15c4d654724af2bc133947a5693',
    sort_by: 'popularity.desc',
  };
  if (genreSelected) {
    params.with_genres = genreSelected;
  }
  axios({
    url: 'https://api.themoviedb.org/3/discover/movie',
    params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  }).then((response) => {
    const movies = parseResults(response);
    appendMovies(movies);
  }).catch((error) => console.log(error));
};

const appendFilter = (options) => {
  const filtersList = document.getElementById('filters');
  const fragment = document.getElementById('filter-template');
  const filterInstance = document.importNode(fragment.content, true);
  const filterSelect = filterInstance.querySelector('#filter-select');

  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', option.value);
    optionElement.setAttribute('id', 'filter-option');
    optionElement.innerHTML = option.text;
    filterSelect.appendChild(optionElement);
  });

  filterSelect.addEventListener('change', (event) => {
    genreSelected = filterSelect.options[filterSelect.selectedIndex].value;
    getMovies();
  });
  filtersList.append(filterInstance);
};

axios({
  url: 'https://api.themoviedb.org/3/genre/movie/list',
  params: {
    api_key: '6ef8f15c4d654724af2bc133947a5693',
  },
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  method: 'GET',
}).then((response) => {
  const genres = response.data.genres.map((genre) => ({ text: genre.name, value: genre.id }));
  const genresWithEmptyOption = [{ text: 'All genres', value: '' }].concat(genres);
  appendFilter(genresWithEmptyOption);
}).catch((error) => console.log(error));

getMovies();
