import Algorithm from './algorithm';
import Board from '../board';

export default class RandomAlgo extends Algorithm {
  name = 'ランダム選択';

  async think(board: Board, isBlackTrun: boolean): Promise<number[]> {
    while (true) {
      const r = Math.floor(Math.random() * 8) + 1,
        c = Math.floor(Math.random() * 8) + 1;
      if (board.checkTurnCount(r, c, isBlackTrun) > 0)
        return Promise.resolve([r, c]);
    }
  }
}
