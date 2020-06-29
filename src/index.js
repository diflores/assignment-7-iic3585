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

axios({
  url: 'https://api.themoviedb.org/3/discover/movie',
  params: {
    api_key: '6ef8f15c4d654724af2bc133947a5693',
    sort_by: 'popularity.desc',
  },
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  method: 'GET',
}).then((response) => {
  const movies = parseResults(response);
  appendMovies(movies);
}).catch((error) => console.log(error));
