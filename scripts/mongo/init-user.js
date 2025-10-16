// Switch to the target database
use("impostor")

// Create application user for the impostor database
try {
  db.createUser({
    user: process.env.MONGO_USER,
    pwd: process.env.MONGO_PASSWORD,
    roles: [
      {
        role: "readWrite",
        db: "impostor",
      },
    ],
  })
  print(`✅ User '${process.env.MONGO_USER}' created for 'impostor' database.`)
} catch (e) {
  if (e.code === 51003) {
    print(`⚠️ User '${process.env.MONGO_USER}' already exists. Continuing.`)
  } else {
    print(`❌ Error creating user: ${e.message}`)
  }
}
