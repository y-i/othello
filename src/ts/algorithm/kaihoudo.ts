import Algorithm from './algorithm';
import Board from '../board';

export default class KaihoudoAlgo extends Algorithm {
  name = '開放度理論(1手)';

  async think(board: Board, isBlackTrun: boolean): Promise<number[]> {
    let result = [0, 0];
    let minKaihoudo = 10000;
    for (let i = 1; i <= 8; ++i) {
      for (let j = 1; j <= 8; ++j) {
        if (board.checkTurnCount(i, j, isBlackTrun) === 0) continue;
        const kaihoudo = board.checkKaihoudo(i, j, isBlackTrun) + Math.random();
        if (kaihoudo < minKaihoudo) {
          result = [i, j];
          minKaihoudo = kaihoudo;
        }
      }
    }
    console.log(result, Math.floor(minKaihoudo));
    return Promise.resolve(result);
  }
}
