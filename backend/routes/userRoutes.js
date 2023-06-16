const express = require('express');
const {
  registerUser,
  authUser,
  allUsers,
} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, allUsers);
// router.route('/').get((req,res) => { res.json({msg: 'This is CORS-enabled for all origins!'})})
router.route('/').post(registerUser);
router.post('/login', authUser);

module.exports = router;
