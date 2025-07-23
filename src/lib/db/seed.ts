import { db, dailyMoments } from "./index";

async function seed() {
  console.log("Seeding database...");
  
  const sampleData = [
    {
      id: "1",
      date: new Date(Date.now() - 86400000).toDateString(),
      moments: ["หลานโทรมาคุย", "อาหารอร่อย", "นอนหลับสบาย"],
      mood: "peaceful",
      recorded: true,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000)
    },
    {
      id: "2", 
      date: new Date(Date.now() - 172800000).toDateString(),
      moments: ["เพื่อนมาเยี่ยม", "สุขภาพดี", "อากาศดี"],
      mood: "happy",
      recorded: true,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000)
    }
  ];

  for (const data of sampleData) {
    await db.insert(dailyMoments).values(data).onConflictDoNothing().run();
  }
  
  console.log("Database seeded successfully!");
}

seed().catch(console.error);