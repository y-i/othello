import Algorithm from './algorithm';
import Board from '../board';

export default class Player extends Algorithm {
  name = 'Player';

  async think(board: Board, isBlackTrun: boolean): Promise<number[]> {
    return Promise.resolve([]);
  }
}
