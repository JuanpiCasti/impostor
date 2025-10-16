// Switch to the target database
use("impostor")

// Insert LoL Champions category
let categories = [{ name: "LoL Champions" }]

try {
  let result = db.Category.insertMany(categories, { ordered: false })
  print(`✅ Category 'LoL Champions' inserted.`)
} catch (e) {
  if (e.code === 11000) {
    print("⚠️ Category 'LoL Champions' already exists. Continuing.")
  } else {
    print(`❌ Error inserting category: ${e.message}`)
  }
}

// Insert LoL Champions words - All League of Legends champions
let words = [
  { word: "Aatrox", category: "LoL Champions" },
  { word: "Ahri", category: "LoL Champions" },
  { word: "Akali", category: "LoL Champions" },
  { word: "Akshan", category: "LoL Champions" },
  { word: "Alistar", category: "LoL Champions" },
  { word: "Ambessa", category: "LoL Champions" },
  { word: "Amumu", category: "LoL Champions" },
  { word: "Anivia", category: "LoL Champions" },
  { word: "Annie", category: "LoL Champions" },
  { word: "Aphelios", category: "LoL Champions" },
  { word: "Ashe", category: "LoL Champions" },
  { word: "Aurelion Sol", category: "LoL Champions" },
  { word: "Aurora", category: "LoL Champions" },
  { word: "Azir", category: "LoL Champions" },
  { word: "Bard", category: "LoL Champions" },
  { word: "Bel'Veth", category: "LoL Champions" },
  { word: "Blitzcrank", category: "LoL Champions" },
  { word: "Brand", category: "LoL Champions" },
  { word: "Braum", category: "LoL Champions" },
  { word: "Briar", category: "LoL Champions" },
  { word: "Caitlyn", category: "LoL Champions" },
  { word: "Camille", category: "LoL Champions" },
  { word: "Cassiopeia", category: "LoL Champions" },
  { word: "Cho'Gath", category: "LoL Champions" },
  { word: "Corki", category: "LoL Champions" },
  { word: "Darius", category: "LoL Champions" },
  { word: "Diana", category: "LoL Champions" },
  { word: "Dr. Mundo", category: "LoL Champions" },
  { word: "Draven", category: "LoL Champions" },
  { word: "Ekko", category: "LoL Champions" },
  { word: "Elise", category: "LoL Champions" },
  { word: "Evelynn", category: "LoL Champions" },
  { word: "Ezreal", category: "LoL Champions" },
  { word: "Fiddlesticks", category: "LoL Champions" },
  { word: "Fiora", category: "LoL Champions" },
  { word: "Fizz", category: "LoL Champions" },
  { word: "Galio", category: "LoL Champions" },
  { word: "Gangplank", category: "LoL Champions" },
  { word: "Garen", category: "LoL Champions" },
  { word: "Gnar", category: "LoL Champions" },
  { word: "Gragas", category: "LoL Champions" },
  { word: "Graves", category: "LoL Champions" },
  { word: "Gwen", category: "LoL Champions" },
  { word: "Hecarim", category: "LoL Champions" },
  { word: "Heimerdinger", category: "LoL Champions" },
  { word: "Hwei", category: "LoL Champions" },
  { word: "Illaoi", category: "LoL Champions" },
  { word: "Irelia", category: "LoL Champions" },
  { word: "Ivern", category: "LoL Champions" },
  { word: "Janna", category: "LoL Champions" },
  { word: "Jarvan IV", category: "LoL Champions" },
  { word: "Jax", category: "LoL Champions" },
  { word: "Jayce", category: "LoL Champions" },
  { word: "Jhin", category: "LoL Champions" },
  { word: "Jinx", category: "LoL Champions" },
  { word: "K'Sante", category: "LoL Champions" },
  { word: "Kai'Sa", category: "LoL Champions" },
  { word: "Kalista", category: "LoL Champions" },
  { word: "Karma", category: "LoL Champions" },
  { word: "Karthus", category: "LoL Champions" },
  { word: "Kassadin", category: "LoL Champions" },
  { word: "Katarina", category: "LoL Champions" },
  { word: "Kayle", category: "LoL Champions" },
  { word: "Kayn", category: "LoL Champions" },
  { word: "Kennen", category: "LoL Champions" },
  { word: "Kha'Zix", category: "LoL Champions" },
  { word: "Kindred", category: "LoL Champions" },
  { word: "Kled", category: "LoL Champions" },
  { word: "Kog'Maw", category: "LoL Champions" },
  { word: "LeBlanc", category: "LoL Champions" },
  { word: "Lee Sin", category: "LoL Champions" },
  { word: "Leona", category: "LoL Champions" },
  { word: "Lillia", category: "LoL Champions" },
  { word: "Lissandra", category: "LoL Champions" },
  { word: "Lucian", category: "LoL Champions" },
  { word: "Malphite", category: "LoL Champions" },
  { word: "Malzahar", category: "LoL Champions" },
  { word: "Maokai", category: "LoL Champions" },
  { word: "Master Yi", category: "LoL Champions" },
  { word: "Mel", category: "LoL Champions" },
  { word: "Morgana", category: "LoL Champions" },
  { word: "Naafiri", category: "LoL Champions" },
  { word: "Nami", category: "LoL Champions" },
  { word: "Nasus", category: "LoL Champions" },
  { word: "Nautilus", category: "LoL Champions" },
  { word: "Neeko", category: "LoL Champions" },
  { word: "Nidalee", category: "LoL Champions" },
  { word: "Nilah", category: "LoL Champions" },
  { word: "Nocturne", category: "LoL Champions" },
  { word: "Nunu", category: "LoL Champions" },
  { word: "Olaf", category: "LoL Champions" },
  { word: "Orianna", category: "LoL Champions" },
  { word: "Ornn", category: "LoL Champions" },
  { word: "Pantheon", category: "LoL Champions" },
  { word: "Poppy", category: "LoL Champions" },
  { word: "Pyke", category: "LoL Champions" },
  { word: "Qiyana", category: "LoL Champions" },
  { word: "Rakan", category: "LoL Champions" },
  { word: "Rammus", category: "LoL Champions" },
  { word: "Rek'Sai", category: "LoL Champions" },
  { word: "Rell", category: "LoL Champions" },
  { word: "Renata", category: "LoL Champions" },
  { word: "Renekton", category: "LoL Champions" },
  { word: "Rengar", category: "LoL Champions" },
  { word: "Riven", category: "LoL Champions" },
  { word: "Rumble", category: "LoL Champions" },
  { word: "Ryze", category: "LoL Champions" },
  { word: "Samira", category: "LoL Champions" },
  { word: "Sejuani", category: "LoL Champions" },
  { word: "Senna", category: "LoL Champions" },
  { word: "Seraphine", category: "LoL Champions" },
  { word: "Sett", category: "LoL Champions" },
  { word: "Shen", category: "LoL Champions" },
  { word: "Shyvana", category: "LoL Champions" },
  { word: "Singed", category: "LoL Champions" },
  { word: "Sion", category: "LoL Champions" },
  { word: "Sivir", category: "LoL Champions" },
  { word: "Skarner", category: "LoL Champions" },
  { word: "Smolder", category: "LoL Champions" },
  { word: "Soraka", category: "LoL Champions" },
  { word: "Swain", category: "LoL Champions" },
  { word: "Sylas", category: "LoL Champions" },
  { word: "Syndra", category: "LoL Champions" },
  { word: "Tahm Kench", category: "LoL Champions" },
  { word: "Taliyah", category: "LoL Champions" },
  { word: "Talon", category: "LoL Champions" },
  { word: "Taric", category: "LoL Champions" },
  { word: "Teemo", category: "LoL Champions" },
  { word: "Thresh", category: "LoL Champions" },
  { word: "Tristana", category: "LoL Champions" },
  { word: "Trundle", category: "LoL Champions" },
  { word: "Tryndamere", category: "LoL Champions" },
  { word: "Twisted Fate", category: "LoL Champions" },
  { word: "Twitch", category: "LoL Champions" },
  { word: "Udyr", category: "LoL Champions" },
  { word: "Urgot", category: "LoL Champions" },
  { word: "Varus", category: "LoL Champions" },
  { word: "Vayne", category: "LoL Champions" },
  { word: "Veigar", category: "LoL Champions" },
  { word: "Vel'Koz", category: "LoL Champions" },
  { word: "Vex", category: "LoL Champions" },
  { word: "Vi", category: "LoL Champions" },
  { word: "Viktor", category: "LoL Champions" },
  { word: "Vladimir", category: "LoL Champions" },
  { word: "Volibear", category: "LoL Champions" },
  { word: "Wukong", category: "LoL Champions" },
  { word: "Xayah", category: "LoL Champions" },
  { word: "Xerath", category: "LoL Champions" },
  { word: "Xin Zhao", category: "LoL Champions" },
  { word: "Yasuo", category: "LoL Champions" },
  { word: "Yone", category: "LoL Champions" },
  { word: "Yorick", category: "LoL Champions" },
  { word: "Zac", category: "LoL Champions" },
  { word: "Zed", category: "LoL Champions" },
  { word: "Ziggs", category: "LoL Champions" },
  { word: "Zilean", category: "LoL Champions" },
  { word: "Zoe", category: "LoL Champions" },
  { word: "Zyra", category: "LoL Champions" },
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
