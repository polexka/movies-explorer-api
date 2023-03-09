const Movie = require('../models/movie');
const { accessError } = require('../utils/errors/AccessError');
const { createMovieError, deleteMovieError } = require('../utils/errors/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => {
      if (!movie) return Promise.reject(createMovieError);
      return res.send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) return Promise.reject(deleteMovieError);
      return movie.populate('owner');
    })
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) return Promise.reject(accessError);
      return movie;
    })
    .then(() => Movie.findByIdAndRemove(req.params.movieId, { runValidators: true }))
    .then((movie) => {
      if (!movie) return Promise.reject(deleteMovieError);
      return res.send(movie);
    })
    .catch(next);
};
