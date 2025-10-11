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
  { word: "Rodri", category: "Football" },
  { word: "Vinícius Júnior", category: "Football" },
  { word: "Erling Haaland", category: "Football" },
  { word: "Lamine Yamal", category: "Football" },
  { word: "Jude Bellingham", category: "Football" },
  { word: "Harry Kane", category: "Football" },
  { word: "Lautaro Martínez", category: "Football" },
  { word: "Florian Wirtz", category: "Football" },
  { word: "Dani Carvajal", category: "Football" },
  { word: "Kylian Mbappé", category: "Football" },
  { word: "Mohamed Salah", category: "Football" },
  { word: "Cole Palmer", category: "Football" },
  { word: "Bukayo Saka", category: "Football" },
  { word: "Nico Williams", category: "Football" },
  { word: "Phil Foden", category: "Football" },
  { word: "Toni Kroos", category: "Football" },
  { word: "Dani Olmo", category: "Football" },
  { word: "Martin Ødegaard", category: "Football" },
  { word: "Jamal Musiala", category: "Football" },
  { word: "Fede Valverde", category: "Football" },
  { word: "Robert Lewandowski", category: "Football" },
  { word: "Ademola Lookman", category: "Football" },
  { word: "Emiliano Martínez", category: "Football" },
  { word: "Antonio Rüdiger", category: "Football" },
  { word: "Raphinha", category: "Football" },
  { word: "Granit Xhaka", category: "Football" },
  { word: "Lionel Messi", category: "Football" },
  { word: "William Saliba", category: "Football" },
  { word: "Viktor Gyökeres", category: "Football" },
  { word: "Virgil van Dijk", category: "Football" },
  { word: "Rodrygo", category: "Football" },
  { word: "Hakan Calhanoglu", category: "Football" },
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
  { word: "Serhou Guirassy", category: "Football" },
  { word: "Fabián Ruiz", category: "Football" },
  { word: "Josko Gvardiol", category: "Football" },
  { word: "Nicolò Barella", category: "Football" },
  { word: "Vitinha", category: "Football" },
  { word: "Artem Dovbyk", category: "Football" },
  { word: "Khvicha Kvaratskhelia", category: "Football" },
  { word: "Ederson", category: "Football" },
  { word: "Thibaut Courtois", category: "Football" },
  { word: "Alessandro Bastoni", category: "Football" },
  { word: "Federico Dimarco", category: "Football" },
  { word: "Ollie Watkins", category: "Football" },
  { word: "Julián Alvarez", category: "Football" },
  { word: "Achraf Hakimi", category: "Football" },
  { word: "Gabriel Magalhães", category: "Football" },
  { word: "Luka Modric", category: "Football" },
  { word: "Omar Marmoush", category: "Football" },
  { word: "Son Heung-min", category: "Football" },
  { word: "Rafael Leão", category: "Football" },
  { word: "Victor Boniface", category: "Football" },
  { word: "Bruno Fernandes", category: "Football" },
  { word: "Jeremie Frimpong", category: "Football" },
  { word: "Mats Hummels", category: "Football" },
  { word: "Trent Alexander-Arnold", category: "Football" },
  { word: "Marcus Thuram", category: "Football" },
  { word: "Kyle Walker", category: "Football" },
  { word: "Xavi Simons", category: "Football" },
  { word: "Álvaro Morata", category: "Football" },
  { word: "Ángel Di María", category: "Football" },
  { word: "Marc Cucurella", category: "Football" },
  { word: "Jonathan David", category: "Football" },
  { word: "Victor Osimhen", category: "Football" },
  { word: "Jonathan Tah", category: "Football" },
  { word: "Joshua Kimmich", category: "Football" },
  { word: "James Rodríguez", category: "Football" },
  { word: "Kai Havertz", category: "Football" },
  { word: "Alisson", category: "Football" },
  { word: "Giorgi Mamardashvili​", category: "Football" },
  { word: "Pau Cubarsí", category: "Football" },
  { word: "Andriy Lunin", category: "Football" },
  { word: "Cristian Romero", category: "Football" },
  { word: "Cody Gakpo", category: "Football" },
  { word: "Michael Olise", category: "Football" },
  { word: "David Raya", category: "Football" },
  { word: "Jules Koundé", category: "Football" },
  { word: "Bradley Barcola", category: "Football" },
  { word: "Eduardo Camavinga", category: "Football" },
  { word: "Alexander Isak", category: "Football" },
  { word: "Unai Simón", category: "Football" },
  { word: "Gregor Kobel", category: "Football" },
  { word: "Dusan Vlahovic", category: "Football" },
  { word: "Savinho", category: "Football" },
  { word: "Christian Pulisic", category: "Football" },
  { word: "Mike Maignan", category: "Football" },
  { word: "Riccardo Calafiori", category: "Football" },
  { word: "Aleksandar Mitrovic", category: "Football" },
  { word: "Julian Brandt", category: "Football" },
  { word: "Marcel Sabitzer", category: "Football" },
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

// 4. Create index on category field for efficient querying
try {
  db.Word.createIndex({ category: 1 })
  print("✅ Index created on 'category' field in Word collection.")
} catch (e) {
  print(`❌ Error creating index: ${e.message}`)
}
