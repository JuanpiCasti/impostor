// Switch to the target database
use("impostor")

// Insert Leyendas category
let categories = [{ name: "Leyendas" }]

try {
  let result = db.Category.insertMany(categories, { ordered: false })
  print(`✅ Category 'Leyendas' inserted.`)
} catch (e) {
  if (e.code === 11000) {
    print("⚠️ Category 'Leyendas' already exists. Continuing.")
  } else {
    print(`❌ Error inserting category: ${e.message}`)
  }
}

// Insert Leyendas words - Top 40 greatest football players of all time
let words = [
  { word: "Lionel Messi", category: "Leyendas" },
  { word: "Diego Maradona", category: "Leyendas" },
  { word: "Pelé", category: "Leyendas" },
  { word: "Franz Beckenbauer", category: "Leyendas" },
  { word: "Johan Cruyff", category: "Leyendas" },
  { word: "Ronaldo", category: "Leyendas" },
  { word: "Zinedine Zidane", category: "Leyendas" },
  { word: "Cristiano Ronaldo", category: "Leyendas" },
  { word: "Michel Platini", category: "Leyendas" },
  { word: "Alfredo di Stéfano", category: "Leyendas" },
  { word: "Gerd Müller", category: "Leyendas" },
  { word: "Mané Garrincha", category: "Leyendas" },
  { word: "Franco Baresi", category: "Leyendas" },
  { word: "Ferenc Puskás", category: "Leyendas" },
  { word: "Paolo Maldini", category: "Leyendas" },
  { word: "Romario", category: "Leyendas" },
  { word: "Giuseppe Meazza", category: "Leyendas" },
  { word: "Bobby Charlton", category: "Leyendas" },
  { word: "Ruud Gullit", category: "Leyendas" },
  { word: "Ronaldinho", category: "Leyendas" },
  { word: "Andrés Iniesta", category: "Leyendas" },
  { word: "Sócrates", category: "Leyendas" },
  { word: "Xavi Hernández", category: "Leyendas" },
  { word: "Luis Suárez", category: "Leyendas" },
  { word: "Gianluigi Buffon", category: "Leyendas" },
  { word: "Kaká", category: "Leyendas" },
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

// Create index on category field for efficient querying
try {
  db.Word.createIndex({ category: 1 })
  print("✅ Index created on 'category' field in Word collection.")
} catch (e) {
  print(`❌ Error creating index: ${e.message}`)
}
