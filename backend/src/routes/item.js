// const express = require('express');
// const router = express.Router();
// const { getItemDetails } = require('../controllers/itemController');

// router.get('/item/:id', getItemDetails);

// module.exports = router;




const express = require('express');
const router = express.Router();
const { createItem } = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const {getItemById, getAllItems, requestSwap, redeemItem, acceptSwap, rejectSwap } = require('../controllers/itemController');

router.post('/', authMiddleware, upload.array('images', 5), createItem);
router.get('/:id',authMiddleware, getItemById);
router.post('/:id/swap',authMiddleware, requestSwap);
router.patch('/:id/redeem',authMiddleware, redeemItem);
router.patch('/swap/:requestId/accept', authMiddleware, acceptSwap);
router.patch('/swap/:requestId/reject', authMiddleware, rejectSwap);
router.get('/getitems',authMiddleware, getAllItems);

module.exports = router;