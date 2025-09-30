const Staff = require("./models/Staff");

async function seedAdmin() {
  try {
    const exists = await Staff.findOne({ email: process.env.ADMIN_EMAIL || "rj@example.com" });
    if (exists) {
      console.log("⚠️ Admin already exists, skipping seeding");
      return;
    }

    const admin = new Staff({
      username: "superadmin",  // 👈 required field
      email: process.env.ADMIN_EMAIL || "rj@example.com",
      password: process.env.ADMIN_PASS || "securepassword123",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  }
}

module.exports = seedAdmin;