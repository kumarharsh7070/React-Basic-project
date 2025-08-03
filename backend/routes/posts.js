
import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, [
  check('content', 'Content is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      content: req.body.content,
      author: req.user.id
    });

    const post = await newPost.save();
    
    const postWithAuthor = await post.populate('author', ['name', 'bio', 'avatarUrl']);

    res.json(postWithAuthor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private (to ensure only logged-in users can see the feed)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', ['name', 'bio', 'avatarUrl']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/user/:userId
// @desc    Get all posts by a user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 }).populate('author', ['name', 'bio', 'avatarUrl']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
