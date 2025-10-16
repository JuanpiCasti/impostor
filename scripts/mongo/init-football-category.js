// Switch to the target database
use("impostor")

// Insert Football category
let categories = [{ name: "Football" }]

try {
  let result = db.Category.insertMany(categories, { ordered: false })
  print(`✅ Category 'Football' inserted.`)
} catch (e) {
  if (e.code === 11000) {
    print("⚠️ Category 'Football' already exists. Continuing.")
  } else {
    print(`❌ Error inserting category: ${e.message}`)
  }
}

// Insert Football words
let words = [
  { word: "Rodri", category: "Football" },
  { word: "Vinícius Júnior", category: "Football" },
  { word: "Erling Haaland", category: "Football" },
  { word: "Lamine Yamal", category: "Football" },
  { word: "Jude Bellingham", category: "Football" },
  { word: "Harry Kane", category: "Football" },
  { word: "Lautaro Martínez", category: "Football" },
  { word: "Dani Carvajal", category: "Football" },
  { word: "Kylian Mbappé", category: "Football" },
  { word: "Mohamed Salah", category: "Football" },
  { word: "Cole Palmer", category: "Football" },
  { word: "Nico Williams", category: "Football" },
  { word: "Phil Foden", category: "Football" },
  { word: "Toni Kroos", category: "Football" },
  { word: "Dani Olmo", category: "Football" },
  { word: "Jamal Musiala", category: "Football" },
  { word: "Fede Valverde", category: "Football" },
  { word: "Robert Lewandowski", category: "Football" },
  { word: "Emiliano Martínez", category: "Football" },
  { word: "Antonio Rüdiger", category: "Football" },
  { word: "Raphinha", category: "Football" },
  { word: "Lionel Messi", category: "Football" },
  { word: "Virgil van Dijk", category: "Football" },
  { word: "Rodrygo", category: "Football" },
  { word: "Alex Grimaldo", category: "Football" },
  { word: "Declan Rice", category: "Football" },
  { word: "Rúben Dias", category: "Football" },
  { word: "Kevin De Bruyne", category: "Football" },
  { word: "Luis Díaz", category: "Football" },
  { word: "Alexis Mac Allister", category: "Football" },
  { word: "Pedri", category: "Football" },
  { word: "Bernardo Silva", category: "Football" },
  { word: "Antoine Griezmann", category: "Football" },
  { word: "Cristiano Ronaldo", category: "Football" },
  { word: "Fabián Ruiz", category: "Football" },
  { word: "Josko Gvardiol", category: "Football" },
  { word: "Vitinha", category: "Football" },
  { word: "Khvicha Kvaratskhelia", category: "Football" },
  { word: "Ederson", category: "Football" },
  { word: "Thibaut Courtois", category: "Football" },
  { word: "Julián Alvarez", category: "Football" },
  { word: "Achraf Hakimi", category: "Football" },
  { word: "Luka Modric", category: "Football" },
  { word: "Son Heung-min", category: "Football" },
  { word: "Rafael Leão", category: "Football" },
  { word: "Victor Boniface", category: "Football" },
  { word: "Trent Alexander-Arnold", category: "Football" },
  { word: "Kyle Walker", category: "Football" },
  { word: "Xavi Simons", category: "Football" },
  { word: "Álvaro Morata", category: "Football" },
  { word: "Ángel Di María", category: "Football" },
  { word: "Marc Cucurella", category: "Football" },
  { word: "Jonathan David", category: "Football" },
  { word: "Victor Osimhen", category: "Football" },
  { word: "Joshua Kimmich", category: "Football" },
  { word: "James Rodríguez", category: "Football" },
  { word: "Kai Havertz", category: "Football" },
  { word: "Alisson", category: "Football" },
  { word: "Cristian Romero", category: "Football" },
  { word: "Cody Gakpo", category: "Football" },
  { word: "Michael Olise", category: "Football" },
  { word: "David Raya", category: "Football" },
  { word: "Jules Koundé", category: "Football" },
  { word: "Eduardo Camavinga", category: "Football" },
  { word: "Alexander Isak", category: "Football" },
  { word: "Unai Simón", category: "Football" },
  { word: "Christian Pulisic", category: "Football" },
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
