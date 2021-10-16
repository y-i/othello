import Algorithm from './algorithm';
import Board from '../board';

export default class SimpleAlgo extends Algorithm {
  name = '左上から';

  async think(board: Board, isBlackTrun: boolean): Promise<number[]> {
    for (let i = 1; i <= 8; ++i) {
      for (let j = 1; j <= 8; ++j) {
        if (board.checkTurnCount(i, j, isBlackTrun) > 0)
          return Promise.resolve([i, j]);
      }
    }
    //return Promise.reject('No area');
  }
}
