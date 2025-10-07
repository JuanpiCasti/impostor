export interface PlayerService {}

export function createPlayerService(playerProvider: PlayerProvider) {
  return {
    notifyGameStart: () => {},
  }
}
