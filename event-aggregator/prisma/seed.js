const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean existing data
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleaned existing records.");

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 2. Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Vivek Pandey",
      email: "pandey12056p@gmail.com",
      password: hashedPassword,
      role: "admin",
      college: "UIT",
      branch: "CSE",
      year: "4th Year",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: "Ashish Kumar",
      email: "ashish@gmail.com",
      password: hashedPassword,
      role: "student",
      college: "UIT Prayagraj",
      branch: "CSE",
      year: "3rd Year",
      phone: "9696543445",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Ram Verma",
      email: "ram@gmail.com",
      password: hashedPassword,
      role: "student",
      college: "UIT",
      branch: "IT",
      year: "3rd Year",
      phone: "9876543210",
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: "Neha Singh",
      email: "neha@gmail.com",
      password: hashedPassword,
      role: "student",
      college: "UIT",
      branch: "ECE",
      year: "2nd Year",
      phone: "8765432109",
    },
  });

  const student4 = await prisma.user.create({
    data: {
      name: "Anjali Sharma",
      email: "anjali@gmail.com",
      password: hashedPassword,
      role: "student",
      college: "UIT",
      branch: "CSE",
      year: "4th Year",
      phone: "7654321098",
    },
  });

  const student5 = await prisma.user.create({
    data: {
      name: "Shivani Patel",
      email: "shivani@gmail.com",
      password: hashedPassword,
      role: "student",
      college: "UIT",
      branch: "CSE",
      year: "3rd Year",
      phone: "6543210987",
    },
  });

  console.log("Seeded 6 user accounts.");

  // 3. Create Events
  const eventsData = [
    {
      title: "AI Hackathon 2026",
      category: "Hackathon",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
      description: "Build cutting-edge artificial intelligence projects in this 48-hour team hackathon.",
      location: "UIT campus, Lab 3",
      mode: "Offline",
      organizer: "AI Club UIT",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      registrationDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      maxParticipants: 100,
      prize: "50000",
      teamSize: "4",
      status: "Upcoming",
      certificateAvailable: true,
    },
    {
      title: "Web Dev Challenge",
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166",
      description: "Showcase your frontend and backend skills by developing responsive web applications.",
      location: "Online",
      mode: "Online",
      organizer: "Web Developers Club",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      maxParticipants: 150,
      prize: "20000",
      teamSize: "1",
      status: "Upcoming",
      certificateAvailable: true,
    },
    {
      title: "Tech Workshop",
      category: "Seminar",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      description: "Learn about the latest trends in software engineering, system designs, and tooling.",
      location: "UIT Main Auditorium",
      mode: "Offline",
      organizer: "Computer Science Dept",
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxParticipants: 200,
      prize: "0",
      teamSize: "1",
      status: "Upcoming",
      certificateAvailable: true,
    },
    {
      title: "Flutter Innovation",
      category: "Hackathon",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      description: "Build cross-platform mobile apps using Flutter in this exciting design sprint.",
      location: "UIT Prayagraj",
      mode: "Offline",
      organizer: "GDG Club",
      date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      registrationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      maxParticipants: 80,
      prize: "30000",
      teamSize: "3",
      status: "Upcoming",
      certificateAvailable: true,
    },
    {
      title: "Cloud Computing Summit",
      category: "Seminar",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      description: "Deploying production-grade scalable systems in AWS, GCP, and Azure clouds.",
      location: "Virtual Classroom 1",
      mode: "Online",
      organizer: "AWS Student Club",
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      maxParticipants: 300,
      prize: "0",
      teamSize: "1",
      status: "Upcoming",
      certificateAvailable: false,
    },
    {
      title: "Design Thinking Workshop",
      category: "Cultural",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
      description: "User experience research, sketching, low-fi wireframing, and interactive prototyping.",
      location: "Drawing Hall 1",
      mode: "Offline",
      organizer: "UIUX Club UIT",
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      registrationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      maxParticipants: 50,
      prize: "10000",
      teamSize: "2",
      status: "Upcoming",
      certificateAvailable: true,
    },
    {
      title: "Sports Fest",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
      description: "Annual college sports tournament including cricket, football, basketball, and athletics.",
      location: "UIT Main Ground",
      mode: "Offline",
      organizer: "Sports Council",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Completed event 2 days ago
      registrationDeadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      maxParticipants: 500,
      prize: "15000",
      teamSize: "11",
      status: "Completed",
      certificateAvailable: true,
    },
  ];

  const seededEvents = [];
  for (const e of eventsData) {
    const event = await prisma.event.create({ data: e });
    seededEvents.push(event);
  }

  console.log(`Seeded ${seededEvents.length} events.`);

  // 4. Create Registrations over the last 7 days
  const registrationsData = [
    {
      fullName: "Ram Verma",
      email: "ram@gmail.com",
      phone: "9876543210",
      college: "UIT",
      branch: "IT",
      year: "3rd Year",
      eventTitle: "AI Hackathon 2026",
      reason: "Interested in AI",
      daysAgo: 6, // 6 days ago
    },
    {
      fullName: "Neha Singh",
      email: "neha@gmail.com",
      phone: "8765432109",
      college: "UIT",
      branch: "ECE",
      year: "2nd Year",
      eventTitle: "Web Dev Challenge",
      reason: "To improve web dev",
      daysAgo: 5,
    },
    {
      fullName: "Ashish Kumar",
      email: "ashish@gmail.com",
      phone: "9696543445",
      college: "UIT Prayagraj",
      branch: "CSE",
      year: "3rd Year",
      eventTitle: "Tech Workshop",
      reason: "Wants to learn system design",
      daysAgo: 4,
    },
    {
      fullName: "Anjali Sharma",
      email: "anjali@gmail.com",
      phone: "7654321098",
      college: "UIT",
      branch: "CSE",
      year: "4th Year",
      eventTitle: "Flutter Innovation",
      reason: "Wants to build mobile apps",
      daysAgo: 3,
    },
    {
      fullName: "Shivani Patel",
      email: "shivani@gmail.com",
      phone: "6543210987",
      college: "UIT",
      branch: "CSE",
      year: "3rd Year",
      eventTitle: "Cloud Computing Summit",
      reason: "Wants to study AWS cloud",
      daysAgo: 2,
    },
    {
      fullName: "Ashish Kumar",
      email: "ashish@gmail.com",
      phone: "9696543445",
      college: "UIT Prayagraj",
      branch: "CSE",
      year: "3rd Year",
      eventTitle: "AI Hackathon 2026",
      reason: "For resume building",
      daysAgo: 2,
    },
    {
      fullName: "Ram Verma",
      email: "ram@gmail.com",
      phone: "9876543210",
      college: "UIT",
      branch: "IT",
      year: "3rd Year",
      eventTitle: "Web Dev Challenge",
      reason: "Improve portfolio",
      daysAgo: 1,
    },
    {
      fullName: "Neha Singh",
      email: "neha@gmail.com",
      phone: "8765432109",
      college: "UIT",
      branch: "ECE",
      year: "2nd Year",
      eventTitle: "Tech Workshop",
      reason: "Interest in seminar topics",
      daysAgo: 1,
    },
    {
      fullName: "Anjali Sharma",
      email: "anjali@gmail.com",
      phone: "7654321098",
      college: "UIT",
      branch: "CSE",
      year: "4th Year",
      eventTitle: "Cloud Computing Summit",
      reason: "Learn server deployments",
      daysAgo: 0, // today
    },
    {
      fullName: "Shivani Patel",
      email: "shivani@gmail.com",
      phone: "6543210987",
      college: "UIT",
      branch: "CSE",
      year: "3rd Year",
      eventTitle: "Design Thinking Workshop",
      reason: "Interest in UIUX design",
      daysAgo: 0, // today
    },
    // Seeding completed events with certificates
    {
      fullName: "Ashish Kumar",
      email: "ashish@gmail.com",
      phone: "9696543445",
      college: "UIT Prayagraj",
      branch: "CSE",
      year: "3rd Year",
      eventTitle: "Sports Fest",
      reason: "Athletics checkin",
      daysAgo: 3,
      certificateIssued: true,
      certificateId: "CERT-SPORTS-ASHISH",
      certificateIssuedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      fullName: "Ram Verma",
      email: "ram@gmail.com",
      phone: "9876543210",
      college: "UIT",
      branch: "IT",
      year: "3rd Year",
      eventTitle: "Sports Fest",
      reason: "Cricket match checkin",
      daysAgo: 3,
      certificateIssued: true,
      certificateId: "CERT-SPORTS-RAM",
      certificateIssuedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const reg of registrationsData) {
    const regDate = new Date();
    regDate.setDate(regDate.getDate() - reg.daysAgo);

    const event = seededEvents.find((evt) => evt.title === reg.eventTitle);

    await prisma.registration.create({
      data: {
        eventId: event ? event.id : 999,
        eventTitle: reg.eventTitle,
        fullName: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        college: reg.college,
        branch: reg.branch,
        year: reg.year,
        reason: reg.reason,
        createdAt: regDate,
        certificateIssued: reg.certificateIssued || false,
        certificateId: reg.certificateId || null,
        certificateIssuedAt: reg.certificateIssuedAt || null,
      },
    });
  }

  console.log("Seeded 12 event registrations.");
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
