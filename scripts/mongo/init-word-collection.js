// 1. Switch to the target database
use("impostor")

// --- USER CREATION ---
// Create a user with readWrite privileges specifically for the 'impostor' database.
// NOTE: This user must be created by an authenticated root user (admin/123456).
// In a production environment, use a strong password instead of 'impostor123'.

try {
  db.createUser({
    user: "userImpostor",
    pwd: "impostor123", // Change this to a secure password in production!
    roles: [
      {
        role: "readWrite",
        db: "impostor",
      },
    ],
  })
  print("✅ User 'userImpostor' created successfully.")
} catch (e) {
  if (e.code === 51) {
    print("ℹ️ User 'userImpostor' already exists. Skipping creation.")
  } else {
    print(`❌ Error creating user: ${e.message}`)
  }
}

// --- DATA INSERTION ---
// Define initial word documents
let words = [
  {
    word: "Messi",
    category: "Football",
    // Add a timestamp for better data structure
    createdAt: new Date(),
  },
  {
    word: "Modric",
    category: "Football",
    createdAt: new Date(),
  },
  { word: "cr7", category: "Football" },
]

// Insert the data into the 'Word' collection
try {
  let result = db.Word.insertMany(words, { ordered: false })
  print(
    `✅ Documents inserted into 'Word' collection. Count: ${result.insertedIds.length}`,
  )
} catch (e) {
  // Error code 11000 is a duplicate key error (if you had a unique index)
  if (e.code === 11000) {
    print("⚠️ Some documents might be duplicates. Continuing.")
  } else {
    print(`❌ Error inserting data: ${e.message}`)
  }
}
