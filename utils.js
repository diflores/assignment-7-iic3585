const posterBaseURL = "http://image.tmdb.org/t/p/w185";

export const parseResults = (response) => {
  const movies = [];
  response.data.results.forEach((movie) => {
    if (movie.poster_path) {
      const result = {};
      result["posterURL"] = `${posterBaseURL}${movie.poster_path}`;
      result["id"] = movie.id;
      result["title"] = movie.title;
      result["plot"] =
        movie.overview.length > 140
          ? movie.overview.substring(0, 140).trimRight() + "..."
          : movie.overview;
      movies.push(result);
    }
  });
  return movies;
};
