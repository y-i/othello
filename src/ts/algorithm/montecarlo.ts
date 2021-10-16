import Algorithm from './algorithm';
import Board, { Stone } from '../board';

interface Score {
  position: number[];
  n: number;
  win: number;
}

export default class MonteCalroAlgo extends Algorithm {
  name = '原始モンテカルロ法';
  repeat = 100;

  async think(board: Board, isBlackTrun: boolean): Promise<number[]> {
    console.time('think');
    const candidates: number[][] = board.board.reduce(
      (ary, row, i): number[][] => {
        ary.push(
          ...row.reduce(
            (ary, _, j): number[][] => {
              if (board.checkTurnCount(i, j, isBlackTrun) > 0) ary.push([i, j]);
              return ary;
            },
            [] as number[][]
          )
        );
        return ary;
      },
      [] as number[][]
    );
    const spaces = board.board.reduce(
      (ary, row, i) => {
        ary.push(
          ...row.reduce((ary, sq, j) => {
            if (sq === Stone.Empty) ary.push([i, j]);
            return ary;
          }, [])
        );
        return ary;
      },
      [] as number[][]
    );

    const scores: Score[] = candidates.map(candidate => {
      return {
        position: candidate,
        n: 0,
        win: Math.random() / 2
      };
    });

    console.log(candidates.length);
    for (const [i, candidate] of candidates.entries()) {
      for (let times = 0; times < this.repeat; ++times) {
        //if (times % 50 === 0) console.log({ times });
        const simulateSpaces = spaces.filter(
          space => space[0] != candidate[0] || space[1] != candidate[1]
        );
        const nextBoard = board.copy();
        let simulateIsBlackTrun = isBlackTrun;
        nextBoard.turn(candidate[0], candidate[1], simulateIsBlackTrun);
        simulateIsBlackTrun = !simulateIsBlackTrun;

        let isPrevPass = false;
        while (simulateSpaces.length != 0) {
          const shuffle = (ary: number[][]): number[][] => {
            const len = ary.length;
            for (let i = len - 1; i >= 0; --i) {
              const target = Math.floor(Math.random() * len);
              [ary[i], ary[target]] = [ary[target], ary[i]];
            }
            return ary;
          };

          let isPass = true;
          for (const [index, space] of shuffle(simulateSpaces).entries()) {
            /*
            if (index % 50 === 0)
              console.log({
                times,
                index,
                'simulateSpaces.length': simulateSpaces.length
              });
              */
            const r = space[0],
              c = space[1];
            try {
              nextBoard.turn(r, c, simulateIsBlackTrun);
              simulateSpaces.splice(index, 1);
              isPrevPass = false;
              isPass = false;
              break;
            } catch (e) {}
          }
          if (isPrevPass) break;
          if (isPass) isPrevPass = true;
          simulateIsBlackTrun = !simulateIsBlackTrun;
        }
        scores[i].n += 1;
        if (nextBoard.blackStone === nextBoard.whiteStone) scores[i].win += 0.5;
        else if (isBlackTrun && nextBoard.blackStone > nextBoard.whiteStone)
          scores[i].win += 1;
        else if (!isBlackTrun && nextBoard.blackStone < nextBoard.whiteStone)
          scores[i].win += 1;
      }
    }

    const result = scores.reduce((result, score) => {
      if (score.win / (score.n + 0.001) > result.win / (result.n + 0.001))
        return score;
      else return result;
    });
    console.timeEnd('think');
    console.log(result.win / (result.n + 0.001));

    return Promise.resolve(result.position);
  }
}
