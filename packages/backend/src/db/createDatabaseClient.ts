import { MongoClient } from "mongodb"
import { Logger } from "pino"

export async function createDatabaseClient(
  host: string,
  port: string,
  user: string,
  password: string,
  database: string,
  logger: Logger,
) {
  const connString = `mongodb://${user}:${password}@${host}:${port}/${database}`
  const client: MongoClient = new MongoClient(connString)
  try {
    await client.connect()
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Could not connect to the database: " + err.message)
    }
    throw err
  }
  return client
}
