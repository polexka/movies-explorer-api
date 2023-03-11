const router = require('express').Router();
const { login, signup, signout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { notFoundError } = require('../utils/errors/NotFoundError');
const { loginValidation, signupValidation } = require('../utils/requestValidation');

router.post('/signin', loginValidation, login);

router.post('/signup', signupValidation, signup);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.post('/signout', signout);

router.use((req, res, next) => next(notFoundError));

module.exports = router;
