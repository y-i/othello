export enum Stone {
  Empty,
  Black,
  White,
  Wall
}

export default class Board {
  private _board: Stone[][];
  private _num: number[];

  constructor() {
    this._board = [...Array(10)].map(() => Array(10).fill(Stone.Empty));
    this._board[4][4] = this._board[5][5] = Stone.White;
    this._board[4][5] = this._board[5][4] = Stone.Black;
    for (let i = 0; i < 10; ++i) {
      this._board[0][i] = Stone.Wall;
      this._board[9][i] = Stone.Wall;
      this._board[i][0] = Stone.Wall;
      this._board[i][9] = Stone.Wall;
    }
    this._num = new Array(2).fill(2);
  }

  get board(): Stone[][] {
    // 番兵を削った盤を返したいかも
    return this._board;
  }

  get blackStone(): number {
    return this._num[1];
  }

  get whiteStone(): number {
    return this._num[0];
  }

  turn(r: number, c: number, isBlackTurn: boolean): void {
    if (this.checkTurnCount(r, c, isBlackTurn, true) === 0) {
      throw `Invalid Move! ${isBlackTurn ? 'Black' : 'White'} ${r}, ${c}`;
    }
    this._board[r][c] = isBlackTurn ? Stone.Black : Stone.White;
    this._num[isBlackTurn ? 1 : 0] += 1;
  }

  checkHasValidMove(isBlackTurn: boolean): boolean {
    return this.board.some((row, i) =>
      row.some((_, j) => this.checkTurnCount(i, j, isBlackTurn) > 0)
    );
  }

  checkTurnCount(
    x: number,
    y: number,
    isBlackTurn: boolean,
    isPut: boolean = false
  ): number {
    if (this._board[x][y] !== Stone.Empty) return 0;
    if (x < 1 || x > 8 || y < 1 || y > 8) return 0;

    let count = 0;
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (i == 0 && j == 0) continue;
        const myColor = isBlackTurn ? Stone.Black : Stone.White;
        const opColor = isBlackTurn ? Stone.White : Stone.Black;

        if (this._board[x + i][y + j] !== opColor) continue;

        let diff = 2;
        while (this._board[x + diff * i][y + diff * j] === opColor) ++diff;
        if (this._board[x + diff * i][y + diff * j] !== myColor) continue;
        count += diff - 1;
        if (!isPut) continue;
        this._num[isBlackTurn ? 1 : 0] += diff - 1;
        this._num[!isBlackTurn ? 1 : 0] -= diff - 1;

        while (--diff > 0)
          this._board[x + diff * i][y + diff * j] = isBlackTurn
            ? Stone.Black
            : Stone.White;
      }
    }
    return count;
  }

  // 雑実装
  checkKaihoudo(x: number, y: number, isBlackTurn: boolean): number {
    if (this._board[x][y] !== Stone.Empty) return 0;
    if (x < 1 || x > 8 || y < 1 || y > 8) return 0;

    let count = 0;
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (i == 0 && j == 0) continue;
        const myColor = isBlackTurn ? Stone.Black : Stone.White;
        const opColor = isBlackTurn ? Stone.White : Stone.Black;

        if (this._board[x + i][y + j] !== opColor) continue;

        let diff = 2;
        while (this._board[x + diff * i][y + diff * j] === opColor) ++diff;
        if (this._board[x + diff * i][y + diff * j] !== myColor) continue;

        while (--diff > 0) {
          if (diff === 1) --count;
          for (let k = -1; k <= 1; ++k) {
            for (let l = -1; l <= 1; ++l) {
              if (this._board[x + k][y + l] === Stone.Empty) ++count;
            }
          }
        }
      }
    }
    return count;
  }

  copy(): Board {
    const newBoard = new Board();
    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        newBoard._board[i][j] = this._board[i][j];
      }
    }
    newBoard._num = { ...this._num };
    return newBoard;
  }

  // nextBoard()の作成、putEventの共通部分の分離、(開放度理論2手ver)
  // comに打たせる部分の関数化
}
