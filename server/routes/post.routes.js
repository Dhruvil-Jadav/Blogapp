const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/post.controller');

router.get('/', ctrl.getPosts);
router.get('/mine', authenticate, ctrl.getMyPosts);
router.get('/admin/stats', authenticate, authorize('admin'), ctrl.getStats);
router.post('/', authenticate, ctrl.createPost);
router.delete('/:id', authenticate, ctrl.deletePost);

module.exports = router;

// const router = require('express').Router();
// const { authenticate } = require('../middleware/auth');
// const ctrl = require('../controllers/post.controller');

// router.get('/', ctrl.getPosts);                       // public
// router.get('/mine', authenticate, ctrl.getMyPosts);   // protected
// router.post('/', authenticate, ctrl.createPost);      // protected

// module.exports = router;