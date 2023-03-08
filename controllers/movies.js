const Movie = require('../models/movie');
const { accessError } = require('../utils/AccessError');
const { notFoundError } = require('../utils/NotFoundError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
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
    trailer,
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
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => {
      if (!movie) return Promise.reject(notFoundError);
      return res.send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) return Promise.reject(notFoundError);
      return movie.populate('owner');
    })
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) return Promise.reject(accessError);
      return movie;
    })
    .then(() => Movie.findByIdAndRemove(req.params.movieId, { runValidators: true }))
    .then((movie) => {
      if (!movie) return Promise.reject(notFoundError);
      return res.send(movie);
    })
    .catch(next);
};
