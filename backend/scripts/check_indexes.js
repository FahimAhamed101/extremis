require("dotenv").config();
const connectDB = require("../src/config/db");
const User = require("../src/models/User");

async function check() {
  await connectDB();
  const user = await User.findOne({ email: "fahimahamedweb@gmail.com" });
  console.log("FAHIM USER:", JSON.stringify(user, null, 2));
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
