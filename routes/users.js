const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  findUserMe,
  updateUserInfo,

} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', findUserMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = router;
