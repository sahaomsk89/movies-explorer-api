const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundErr');
const WrongDataErr = require('../errors/WrongDataErr');
const CannotBeDeletedError = require('../errors/CannotBeDeleted');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movie) => res.send(movie))
    .catch((err) => next(err));
};

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataErr('неверные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).then((movie) => {
    if (!movie) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (req.user._id === movie.owner.toString()) {
      movie.findByIdAndRemove(req.params.movieId)
        .then(() => {
          res.send(movie);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new WrongDataErr('неверные данные'));
            return;
          }
          next(err);
        });
      return;
    }
    throw new CannotBeDeletedError('Невозможно удалить карту других пользователей');
  })
    .catch((err) => next(err));
};
