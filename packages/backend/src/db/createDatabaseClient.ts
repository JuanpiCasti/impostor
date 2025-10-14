import { MongoClient } from "mongodb"
import { Logger } from "pino"

export async function createDatabaseClient(
  connectionString: string,
  logger: Logger,
) {
  logger.info("Connecting to MongoDB")

  const client: MongoClient = new MongoClient(connectionString)
  try {
    await client.connect()
    logger.info("Successfully connected to MongoDB")
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Could not connect to the database: " + err.message)
    }
    throw err
  }
  return client
}
