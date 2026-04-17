const router = require('express').Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { keywords: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = category;
    }
    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        user: true,
        club: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load posts' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, keywords, club_id } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'title, description, and category are required' });
    }
    const post = await prisma.communityPost.create({
      data: {
        title,
        description,
        category,
        keywords: keywords || '',
        club_id: club_id || null,
        user_id: req.user.id,
      },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create post' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!post || post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }
    const { title, description, category, keywords, club_id } = req.body;
    const updated = await prisma.communityPost.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        category,
        keywords: keywords || post.keywords,
        club_id: club_id || post.club_id,
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update post' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!post || post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    await prisma.communityPost.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete post' });
  }
});

module.exports = router;
