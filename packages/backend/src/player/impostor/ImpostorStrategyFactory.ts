import { ImpostorStrategy } from "./ImpostorStrategy"
import { RandomImpostorStrategy } from "./RandomImpostorStrategy"

export enum ImpostorStrategyType {
  RANDOM = "RANDOM",
  ALL_IMPOSTOR = "ALL_IMPOSTOR",
}

export interface ImpostorStrategyFactory {
  create: (type: ImpostorStrategyType) => ImpostorStrategy
}

export function createImpostorStrategyFactory(): ImpostorStrategyFactory {
  return {
    create(type: ImpostorStrategyType) {
      switch (type) {
        case ImpostorStrategyType.RANDOM:
          return RandomImpostorStrategy()
        case ImpostorStrategyType.ALL_IMPOSTOR:
          throw new Error("ALL_IMPOSTOR strategy not implemented yet")
        default:
          throw new Error(`Unknown impostor strategy type: ${type}`)
      }
    },
  }
}
