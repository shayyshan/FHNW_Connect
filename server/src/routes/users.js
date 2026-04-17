const router = require('express').Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        favoriteClubs: { include: { club: true } },
        favoriteActivities: { include: { activity: true } },
        activities: { include: { activity: true } },
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      favoriteClubs: user.favoriteClubs.map((fav) => fav.club),
      favoriteActivities: user.favoriteActivities.map((fav) => fav.activity),
      joinedActivities: user.activities.map((record) => ({
        ...record.activity,
        joined_at: record.joined_at,
        registration_status: record.registration_status,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to load user profile' });
  }
});

module.exports = router;
