export enum Stone {
  Empty,
  Black,
  White
}

export default class Board {
  private _board: Stone[][];

  constructor() {
    this._board = [...Array(10)].map(() => Array(10).fill(Stone.Empty));
    this._board[4][4] = this._board[5][5] = Stone.Black;
    this._board[4][5] = this._board[5][4] = Stone.White;
  }

  get board(): Stone[][] {
    return this._board;
  }

  turn(r: number, c: number, isBlackTurn: boolean): void {
    if (this.checkTurnCount(r, c, isBlackTurn, true) === 0) {
      throw `Invalid Move! ${isBlackTurn ? 'Black' : 'White'} ${r}, ${c}`;
    }
    this._board[r][c] = isBlackTurn ? Stone.Black : Stone.White;
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
        const opColor = isBlackTurn ? Stone.White : Stone.Black;

        if (this._board[x + i][y + j] !== opColor) continue;

        let diff = 2;
        while (this._board[x + diff * i][y + diff * j] === opColor) ++diff;
        if (this._board[x + diff * i][y + diff * j] === Stone.Empty) continue;
        count += diff - 1;
        if (!isPut) continue;

        while (--diff > 0)
          this._board[x + diff * i][y + diff * j] = isBlackTurn
            ? Stone.Black
            : Stone.White;
      }
    }
    return count;
  }
}
