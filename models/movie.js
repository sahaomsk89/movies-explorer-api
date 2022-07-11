const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // имя — это строка
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true,
  },
  nameEN: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true,
  },

});
module.exports = mongoose.model('movie', movieSchema);
