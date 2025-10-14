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
    create(_type: ImpostorStrategyType) {
      // TODO: Implement more impostor decision strategies
      return RandomImpostorStrategy()
    },
  }
}
