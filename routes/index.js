const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { createUsers, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), login);

  router.post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }), createUsers);
  
  router.use(auth);
  router.use('/users', require('./users'));
  router.use('/movies', require('./movies'));

  module.exports = router;
