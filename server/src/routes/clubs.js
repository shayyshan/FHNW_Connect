const router = require('express').Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        activities: true,
        favoriteBy: true,
      },
      orderBy: { club_name: 'asc' },
    });
    const result = clubs.map((club) => ({
      ...club,
      activity_count: club.activities.length,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load clubs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const club = await prisma.club.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        activities: { orderBy: { activity_date: 'asc' } },
        posts: { orderBy: { created_at: 'desc' } },
      },
    });
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    res.json(club);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load club' });
  }
});

router.post('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const clubId = Number(req.params.id);
    const userId = req.user.id;
    await prisma.userFavoriteClub.create({
      data: { user_id: userId, club_id: clubId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to favorite club' });
  }
});

router.delete('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const clubId = Number(req.params.id);
    const userId = req.user.id;
    const record = await prisma.userFavoriteClub.findFirst({
      where: { user_id: userId, club_id: clubId },
    });
    if (!record) {
      return res.status(404).json({ error: 'Club favorite not found' });
    }
    await prisma.userFavoriteClub.delete({ where: { id: record.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to remove club favorite' });
  }
});

module.exports = router;
