const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundErr');
const WrongDataErr = require('../errors/WrongDataErr');
const CannotBeDeletedError = require('../errors/CannotBeDeleted');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
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
    trailerLink,
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
    trailerLink,
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
  const userId = req.user._id;
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        next(new CannotBeDeletedError('Вы не можете удалить карточку фильма, добавленную другим человеком'));
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then(() => res.status(200).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataErr('неверные данные'));
      }
      next(err);
    });
};
