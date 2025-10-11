// 1. Switch to the target database
use("impostor")

// 2. Create application user for the impostor database
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

let categories = [{ name: "Football" }]

try {
  let result = db.Category.insertMany(categories, { ordered: false })
} catch {
  print("could not insert categories")
}

// 3. Insert initial word data
let words = [
  {
    word: "Messi",
    category: "Football",
    // Add a timestamp for better data structure
  },
  {
    word: "Modric",
    category: "Football",
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
