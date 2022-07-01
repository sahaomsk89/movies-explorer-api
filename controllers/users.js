const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundErr');
const WrongDataErr = require('../errors/WrongDataErr');
const AuthorizationError = require('../errors/AuthorizationErr');
const DuplikatError = require('../errors/DuplikatError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.findUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.createUsers = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(201).send({
      name,
      email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataErr('неверные данные'));
        return;
      }
      if (err.code === 11000) {
        next(new DuplikatError('Пользователь с таким адресом электронной почты уже существует'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      runValidators: true,
      new: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new WrongDataErr('неверные данные');
      }
      if (err.code === 11000) {
        next(new DuplikatError('Пользователь с таким адресом электронной почты уже существует'));
      }
      throw err;
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new AuthorizationError('Email или пароль неверны'));
      }
      next(err);
    });
};
