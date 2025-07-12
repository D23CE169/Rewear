const Item = require('../models/Item.js');
const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');

exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags } = req.body;

    const images = req.files.map(file => file.path); // From multer
    const tagArray = tags?.split(',').map(tag => tag.trim());

    const newItem = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: tagArray,
      images,
      uploader: req.user.id
    });

    await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (err) {
        console.error('❌ Item creation error:', err); // 👈 log error to debug
    res.status(500).json({ error: 'Failed to create item' });
  }
};



// GET item detail by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('uploader', 'name email points');

if (!item) return res.status(404).json({ message: 'Item not found' });

const swapRequests = await SwapRequest.find({ itemId: item._id }).populate('requesterId', 'name email');

res.json({
  _id: item._id,
  title: item.title,
  description: item.description,
  images: item.images,
  category: item.category,
  size: item.size,
  condition: item.condition,
  tags: item.tags,
  availability: item.availability,
  uploader: {
    name: item.uploader.name,
    email: item.uploader.email,
    points: item.uploader.points,
  },
  swapRequests
});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/items/:id/swap - request swap
exports.requestSwap = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (!item.uploader || !req.user?._id) {
      return res.status(400).json({ message: 'Invalid user or item data' });
    }

    if (item.uploader.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own item' });
    }

    const alreadyRequested = await SwapRequest.findOne({
      itemId: item._id,
      requesterId: req.user._id,
      status: 'pending'
    });

    if (alreadyRequested) {
      return res.status(400).json({ message: 'Swap request already sent' });
    }

    const newRequest = await SwapRequest.create({
      itemId: item._id,
      requesterId: req.user._id
    });

    res.status(201).json({ message: 'Swap request sent', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// PATCH /api/items/:id/redeem - redeem using points
exports.redeemItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user');
    const buyer = await User.findById(req.user._id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const itemCost = item.points || 10; // default 10 points
    if (buyer.points < itemCost) {
      return res.status(400).json({ message: 'Not enough points to redeem' });
    }

    buyer.points -= itemCost;
    await buyer.save();

    // Optionally add points to uploader
    item.user.points += itemCost;
    await item.user.save();

    item.availability = 'redeemed';
    await item.save();

    res.json({ message: 'Item redeemed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Accept swap request
exports.acceptSwap = async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'accepted';
    await request.save();

    const item = await Item.findById(request.itemId);
    item.availability = 'swapped';
    await item.save();

    res.json({ message: 'Swap request accepted', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject swap request
exports.rejectSwap = async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Swap request rejected', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET /api/items - fetch all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('uploader', 'name email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};
