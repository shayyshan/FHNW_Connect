const router = require('express').Router();
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

function buildActivityQuery(query) {
  const filters = {};
  if (query.search) {
    filters.OR = [
      { activity_title: { contains: query.search, mode: 'insensitive' } },
      { activity_description: { contains: query.search, mode: 'insensitive' } },
      { activity_location: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.category) {
    filters.activity_category = query.category;
  }
  if (query.clubId) {
    filters.club_id = Number(query.clubId);
  }
  if (query.location) {
    filters.activity_location = { contains: query.location, mode: 'insensitive' };
  }
  if (query.date) {
    filters.activity_date = new Date(query.date);
  }
  return filters;
}

router.get('/', async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      where: buildActivityQuery(req.query),
      orderBy: [{ activity_date: 'asc' }, { start_time: 'asc' }],
      include: {
        club: true,
        participants: true,
        favoriteBy: true,
      },
    });

    const items = activities.map((activity) => ({
      ...activity,
      participant_count: activity.participants.length,
      is_full: activity.participants.length >= activity.max_slots,
    }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load activities' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        club: true,
        participants: {
          include: { user: true },
        },
      },
    });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    const participant_count = activity.participants.length;
    res.json({ ...activity, participant_count });
  } catch (error) {
    res.status(500).json({ error: 'Unable to load activity' });
  }
});

router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const activityId = Number(req.params.id);
    const userId = req.user.id;
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { participants: true },
    });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    if (activity.participants.length >= activity.max_slots) {
      return res.status(400).json({ error: 'Activity is full' });
    }
    const existing = await prisma.userActivity.findFirst({
      where: { user_id: userId, activity_id: activityId },
    });
    if (existing) {
      return res.status(400).json({ error: 'You are already joined' });
    }
    await prisma.userActivity.create({
      data: {
        user_id: userId,
        activity_id: activityId,
        registration_status: 'joined',
      },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to join activity' });
  }
});

router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const activityId = Number(req.params.id);
    const userId = req.user.id;
    const record = await prisma.userActivity.findFirst({
      where: { user_id: userId, activity_id: activityId },
    });
    if (!record) {
      return res.status(400).json({ error: 'Not enrolled in this activity' });
    }
    await prisma.userActivity.delete({ where: { id: record.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to leave activity' });
  }
});

router.post('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const activityId = Number(req.params.id);
    const userId = req.user.id;
    await prisma.userFavoriteActivity.create({
      data: { user_id: userId, activity_id: activityId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to favorite activity' });
  }
});

router.delete('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const activityId = Number(req.params.id);
    const userId = req.user.id;
    const record = await prisma.userFavoriteActivity.findFirst({
      where: { user_id: userId, activity_id: activityId },
    });
    if (!record) {
      return res.status(404).json({ error: 'Activity favorite not found' });
    }
    await prisma.userFavoriteActivity.delete({ where: { id: record.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to remove favorite' });
  }
});

module.exports = router;
