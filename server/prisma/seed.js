const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  await prisma.userFavoriteActivity.deleteMany();
  await prisma.userFavoriteClub.deleteMany();
  await prisma.userActivity.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123', 10);

  const alice = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@example.com',
      password_hash: passwordHash,
    },
  });

  const bob = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@example.com',
      password_hash: passwordHash,
    },
  });

  const codingClub = await prisma.club.create({
    data: {
      club_name: 'Coding Society',
      club_description: 'A club for developers to build projects and learn together.',
      image_path: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    },
  });

  const artClub = await prisma.club.create({
    data: {
      club_name: 'Creative Arts Collective',
      club_description: 'Workshops, exhibitions, and collaborative art sessions for all students.',
      image_path: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    },
  });

  const sportsClub = await prisma.club.create({
    data: {
      club_name: 'Campus Sports Union',
      club_description: 'Organizing competitive sports, fitness events, and student tournaments.',
      image_path: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    },
  });

  const musicClub = await prisma.club.create({
    data: {
      club_name: 'Melody Makers',
      club_description: 'Jam sessions, concerts, and music production learning groups.',
      image_path: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=800&q=80',
    },
  });

  const sustainabilityClub = await prisma.club.create({
    data: {
      club_name: 'Green Futures',
      club_description: 'Action-based sustainability projects and campus environmental events.',
      image_path: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    },
  });

  const debateClub = await prisma.club.create({
    data: {
      club_name: 'Debate League',
      club_description: 'Weekly debate practice, guest speakers, and tournament preparation.',
      image_path: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    },
  });

  const activities = [
    {
      activity_title: 'Hackathon Kickoff',
      activity_description: 'Join student teams to build creative software projects in one weekend.',
      activity_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      start_time: '10:00',
      end_time: '18:00',
      activity_location: 'Innovation Lab',
      max_slots: 30,
      activity_category: 'Technology',
      image_path: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      club_id: codingClub.id,
    },
    {
      activity_title: 'Painting Workshop',
      activity_description: 'Relax and create your own canvas with guided painting exercises.',
      activity_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      start_time: '14:00',
      end_time: '17:00',
      activity_location: 'Art Studio B',
      max_slots: 20,
      activity_category: 'Arts',
      image_path: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      club_id: artClub.id,
    },
    {
      activity_title: 'Morning Yoga Session',
      activity_description: 'A gentle yoga class to energize your morning on campus.',
      activity_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      start_time: '08:00',
      end_time: '09:00',
      activity_location: 'Sports Hall',
      max_slots: 15,
      activity_category: 'Sports',
      image_path: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      club_id: sportsClub.id,
    },
    {
      activity_title: 'Campus Soccer Match',
      activity_description: 'Friendly mixed teams match open to all skill levels.',
      activity_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      start_time: '16:00',
      end_time: '18:00',
      activity_location: 'Main Field',
      max_slots: 22,
      activity_category: 'Sports',
      image_path: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80',
      club_id: sportsClub.id,
    },
    {
      activity_title: 'Open Mic Night',
      activity_description: 'Share music, poetry, and spoken word with the student community.',
      activity_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      start_time: '19:00',
      end_time: '21:30',
      activity_location: 'Campus Cafe',
      max_slots: 40,
      activity_category: 'Music',
      image_path: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      club_id: musicClub.id,
    },
    {
      activity_title: 'Sustainability Panel',
      activity_description: 'Discuss climate action strategies with local campus leaders.',
      activity_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      start_time: '13:00',
      end_time: '14:30',
      activity_location: 'Lecture Hall 1',
      max_slots: 50,
      activity_category: 'Community',
      image_path: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      club_id: sustainabilityClub.id,
    },
    {
      activity_title: 'Debate Practice',
      activity_description: 'Learn public speaking tips and prepare for the next tournament.',
      activity_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      start_time: '18:00',
      end_time: '20:00',
      activity_location: 'Conference Room 3',
      max_slots: 18,
      activity_category: 'Education',
      image_path: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
      club_id: debateClub.id,
    },
    {
      activity_title: 'React Study Group',
      activity_description: 'Collaborate on frontend projects and learn best practices.',
      activity_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      start_time: '17:00',
      end_time: '19:00',
      activity_location: 'Computer Lab 2',
      max_slots: 25,
      activity_category: 'Technology',
      image_path: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      club_id: codingClub.id,
    },
    {
      activity_title: 'Campus Choir Rehearsal',
      activity_description: 'Weekly choir practice for singers of all levels.',
      activity_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      start_time: '18:30',
      end_time: 'Music Hall',
      activity_location: 'Music Hall',
      max_slots: 35,
      activity_category: 'Music',
      image_path: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      club_id: musicClub.id,
    },
    {
      activity_title: 'Street Art Walk',
      activity_description: 'Explore campus murals and discuss urban art with the collective.',
      activity_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      start_time: '15:00',
      end_time: '17:00',
      activity_location: 'Campus Quadrangle',
      max_slots: 25,
      activity_category: 'Arts',
      image_path: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=800&q=80',
      club_id: artClub.id,
    },
  ];

  const createdActivities = [];
  for (const activity of activities) {
    createdActivities.push(await prisma.activity.create({ data: activity }));
  }

  await prisma.userFavoriteClub.createMany({
    data: [
      { user_id: alice.id, club_id: codingClub.id },
      { user_id: alice.id, club_id: sportsClub.id },
      { user_id: bob.id, club_id: musicClub.id },
    ],
  });

  await prisma.userFavoriteActivity.createMany({
    data: [
      { user_id: alice.id, activity_id: createdActivities[0].id },
      { user_id: alice.id, activity_id: createdActivities[2].id },
      { user_id: bob.id, activity_id: createdActivities[4].id },
    ],
  });

  await prisma.userActivity.createMany({
    data: [
      { user_id: alice.id, activity_id: createdActivities[0].id, registration_status: 'joined' },
      { user_id: alice.id, activity_id: createdActivities[2].id, registration_status: 'joined' },
      { user_id: bob.id, activity_id: createdActivities[4].id, registration_status: 'joined' },
    ],
  });

  await prisma.communityPost.createMany({
    data: [
      {
        title: 'Welcome to FHNWConnect',
        description: 'We launched the new campus event platform! Check out upcoming activities and join your favorite club events.',
        category: 'Announcement',
        keywords: 'launch,events,platform',
        club_id: codingClub.id,
        user_id: alice.id,
      },
      {
        title: 'Yoga classes now open',
        description: 'Sign up for the new morning yoga sessions in the Sports Hall. All experience levels welcome.',
        category: 'Wellness',
        keywords: 'yoga,fitness,sports',
        club_id: sportsClub.id,
        user_id: bob.id,
      },
      {
        title: 'Open Mic call for performers',
        description: 'Share your music, spoken word, or comedy at Cafe Stage next Friday.',
        category: 'Community',
        keywords: 'music,performance,open mic',
        club_id: musicClub.id,
        user_id: bob.id,
      },
      {
        title: 'Sustainability Week planning',
        description: 'Green Futures is recruiting volunteers for campus cleanup and workshops.',
        category: 'Volunteer',
        keywords: 'sustainability,environment,volunteer',
        club_id: sustainabilityClub.id,
        user_id: alice.id,
      },
      {
        title: 'Art walk feedback session',
        description: 'Help us choose the next mural theme during the Creative Arts Collective meeting.',
        category: 'Events',
        keywords: 'art,workshop,community',
        club_id: artClub.id,
        user_id: alice.id,
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
