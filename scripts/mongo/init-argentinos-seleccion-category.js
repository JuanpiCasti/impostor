// Switch to the target database
use("impostor")

// Insert Argentinos de selección category
let categories = [{ name: "Argentinos de selección" }]

try {
  let result = db.Category.insertMany(categories, { ordered: false })
  print(`✅ Category 'Argentinos de selección' inserted.`)
} catch (e) {
  if (e.code === 11000) {
    print("⚠️ Category 'Argentinos de selección' already exists. Continuing.")
  } else {
    print(`❌ Error inserting category: ${e.message}`)
  }
}

// Insert Argentinos de selección words
let words = [
  { word: "Lionel Messi", category: "Argentinos de selección" },
  { word: "Javier Mascherano", category: "Argentinos de selección" },
  { word: "Ángel Di María", category: "Argentinos de selección" },
  { word: "Javier Zanetti", category: "Argentinos de selección" },
  { word: "Nicolás Otamendi", category: "Argentinos de selección" },
  { word: "Roberto Ayala", category: "Argentinos de selección" },
  { word: "Diego Simeone", category: "Argentinos de selección" },
  { word: "Sergio Agüero", category: "Argentinos de selección" },
  { word: "Oscar Ruggeri", category: "Argentinos de selección" },
  { word: "Sergio Romero", category: "Argentinos de selección" },
  { word: "Diego Maradona", category: "Argentinos de selección" },
  { word: "Ariel Ortega", category: "Argentinos de selección" },
  { word: "Rodrigo De Paul", category: "Argentinos de selección" },
  { word: "Gabriel Batistuta", category: "Argentinos de selección" },
  { word: "Leandro Paredes", category: "Argentinos de selección" },
  { word: "Juan Pablo Sorín", category: "Argentinos de selección" },
  { word: "Carlos Tevez", category: "Argentinos de selección" },
  { word: "Juan Sebastián Verón", category: "Argentinos de selección" },
  { word: "Gonzalo Higuaín", category: "Argentinos de selección" },
  { word: "Lautaro Martínez", category: "Argentinos de selección" },
  { word: "Nicolás Tagliafico", category: "Argentinos de selección" },
  { word: "Américo Gallego", category: "Argentinos de selección" },
  { word: "Gabriel Heinze", category: "Argentinos de selección" },
  { word: "Daniel Passarella", category: "Argentinos de selección" },
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
