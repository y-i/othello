enum Stone {
  Empty,
  Black,
  White
}

export default class Othello {
  private board: Stone[][];
  private isBlackTurn: boolean;
  private boardElem: HTMLElement;
  private turndElem: HTMLElement;

  constructor(boardElem: HTMLElement, turnElem: HTMLElement) {
    this.boardElem = boardElem;
    this.turndElem = turnElem;
    this.board = [...Array(10)].map(() => Array(10).fill(Stone.Empty));
    this.board[4][4] = this.board[5][5] = Stone.Black;
    this.board[4][5] = this.board[5][4] = Stone.White;
    this.isBlackTurn = true;
  }

  init(): void {
    this.show();
    this.showTurn();
  }

  private show(): void {
    const elem = this.boardElem;
    while (elem.firstChild) elem.removeChild(elem.firstChild);
    elem.append(
      ...this.board
        .map((row, i) => {
          const outer = document.createElement("div");
          outer.append(
            ...row
              .map((sq, j) => {
                const inner = document.createElement("div");
                if (sq === Stone.Empty) {
                  inner.addEventListener("click", e => this.putEvent(e));
                }
                inner.dataset.stone = sq.toString();
                inner.dataset.row = i.toString();
                inner.dataset.col = j.toString();
                return inner;
              })
              .filter((_, i) => i >= 1 && i <= 8)
          );
          return outer;
        })
        .filter((_, i) => i >= 1 && i <= 8)
    );
  }

  private showTurn(): void {
    this.turndElem.innerText = `${this.isBlackTurn ? "Black" : "White"}'s turn`;
  }

  private finish(): void {
    this.turndElem.innerText = "Finish!";
  }

  turn(r: number, c: number, isBlackTurn: boolean): void {
    if (this.checkTurnCount(r, c, isBlackTurn, true) === 0) {
      throw `Invalid Move! ${isBlackTurn ? "Black" : "White"} ${r}, ${c}`;
    }
    this.board[r][c] = isBlackTurn ? Stone.Black : Stone.White;
  }

  private checkHasValidMove(isBlackTurn: boolean): boolean {
    return this.board.some((row, i) =>
      row.some((_, j) => this.checkTurnCount(i, j, isBlackTurn) > 0)
    );
  }

  private checkTurnCount(
    x: number,
    y: number,
    isBlackTurn: boolean,
    isPut: boolean = false
  ): number {
    if (this.board[x][y] !== Stone.Empty) return 0;
    if (x < 1 || x > 8 || y < 1 || y > 8) return 0;

    let count = 0;
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (i == 0 && j == 0) continue;
        const opColor = isBlackTurn ? Stone.White : Stone.Black;

        if (this.board[x + i][y + j] !== opColor) continue;

        let diff = 2;
        while (this.board[x + diff * i][y + diff * j] === opColor) ++diff;
        if (this.board[x + diff * i][y + diff * j] === Stone.Empty) continue;
        count += diff - 1;
        if (!isPut) continue;

        while (--diff > 0)
          this.board[x + diff * i][y + diff * j] = isBlackTurn
            ? Stone.Black
            : Stone.White;
      }
    }
    return count;
  }

  private putEvent(e: MouseEvent) {
    if (!(e.target instanceof HTMLElement)) throw "Invalid target!";

    const r = parseInt(e.target.dataset.row),
      c = parseInt(e.target.dataset.col);
    try {
      this.turn(r, c, this.isBlackTurn);
    } catch (e) {
      console.log(e);
      return;
    }

    this.isBlackTurn = !this.isBlackTurn;
    if (!this.checkHasValidMove(this.isBlackTurn)) {
      this.isBlackTurn = !this.isBlackTurn;
      if (!this.checkHasValidMove(this.isBlackTurn)) {
        this.show();
        this.finish();
      }
    }
    this.show();
    this.showTurn();
  }
}
