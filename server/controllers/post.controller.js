const Post = require('../models/post.model');
const User = require('../models/user.model');

// CREATE — any authenticated user
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content)
      return res.status(400).json({ error: 'title and content are required' });

    const post = await Post.create({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      authorId: req.user.sub,       // 👈 JWT identity → MongoDB document
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('createPost error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ ALL — public, enriched with author names from MySQL
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();  // MongoDB

    // 🌉 Cross-database "JOIN" done in application code
    const ids = [...new Set(posts.map((p) => p.authorId))];
    const authors = await User.findByIds(ids);                       // MySQL
    const nameMap = Object.fromEntries(authors.map((a) => [a.id, a.name]));

    res.json(
      posts.map((p) => ({ ...p, authorName: nameMap[p.authorId] || 'Unknown' }))
    );
  } catch (err) {
    console.error('getPosts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ MINE — filtered by JWT identity
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.user.sub }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE — owner OR admin
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isOwner = post.authorId === req.user.sub;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: 'You can only delete your own posts' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('deletePost error:', err);
    res.status(400).json({ error: 'Invalid post id' });
  }
};

// ADMIN ONLY — stats from BOTH databases
exports.getStats = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();            // MongoDB
    const totalUsers = await User.countAll();                  // MySQL

    const byAuthor = await Post.aggregate([                    // MongoDB pipeline
      { $group: { _id: '$authorId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // enrich aggregation results with MySQL names
    const authors = await User.findByIds(byAuthor.map((a) => a._id));
    const nameMap = Object.fromEntries(authors.map((a) => [a.id, a.name]));

    res.json({
      totalUsers,
      totalPosts,
      byAuthor: byAuthor.map((a) => ({
        authorId: a._id,
        authorName: nameMap[a._id] || 'Unknown',
        count: a.count,
      })),
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};