// const express = require('express');
// const router = express.Router();

// const { register, login } = require('../controllers/authController');
// const validate = require('../middlewares/validate');
// const { registerSchema, loginSchema } = require('../validators/authValidation');

// router.post('/register', validate(registerSchema), register);
// router.post('/login', validate(loginSchema), login);

// module.exports = router;




const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Profile routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
