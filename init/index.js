// Load environment variables from .env in non-production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing"); // Adjust path if needed
const initData = require("./data"); // Should export { data: [...] }

async function main() {
  try {
    const dbUrl = "mongodb+srv://parneet100804_db_user:tC5qcPEJlrZe0gWq@cluster0.cz5rfze.mongodb.net/majorproject?retryWrites=true&w=majority&appName=Cluster0";

    if (!dbUrl) {
      throw new Error("Missing ATLASDB_URL in environment variables");
    }

    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected");

    console.log("Clearing existing listings...");
    await Listing.deleteMany({});

    console.log("Seeding new listings...");
    await Listing.insertMany(initData.data);

    console.log("Data seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err.message || err);
    process.exit(1);
  }
}

main();