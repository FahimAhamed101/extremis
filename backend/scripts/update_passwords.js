require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");

async function run() {
  await connectDB();
  const hash = await bcrypt.hash("password123", 10);
  await User.updateMany(
    { username: { $in: ["shivanshu", "pinky", "spacester"] } },
    { $set: { passwordHash: hash } }
  );
  console.log("Updated passwordHash for shivanshu, pinky, spacester to 'password123'");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
