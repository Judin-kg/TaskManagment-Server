const Auth = require("./models/Admin");

async function seedAdmin() {
  try {
    const exists = await Auth.findOne({ email: process.env.ADMIN_EMAIL || "rj@example.com" });
    if (exists) {
      console.log("⚠️ Admin already exists, skipping seeding");
      return;
    }

    const admin = new Auth({
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
