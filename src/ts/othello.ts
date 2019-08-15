import Board from './board';

export default class Othello {
  private board: Board;
  private isBlackTurn: boolean;
  private boardElem: HTMLElement;
  private turndElem: HTMLElement;

  constructor(boardElem: HTMLElement, turnElem: HTMLElement) {
    this.boardElem = boardElem;
    this.turndElem = turnElem;
    this.board = new Board();
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
      ...this.board.board
        .map((row, i) => {
          const outer = document.createElement('div');
          outer.append(
            ...row
              .map((sq, j) => {
                const inner = document.createElement('div');
                inner.addEventListener('click', e => this.putEvent(e));
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
    this.turndElem.innerText = `${this.isBlackTurn ? 'Black' : 'White'}'s turn`;
  }

  private finish(): void {
    this.turndElem.innerText = 'Finish!';
  }

  private putEvent = (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) throw 'Invalid target!';

    const r = parseInt(e.target.dataset.row),
      c = parseInt(e.target.dataset.col);
    try {
      this.board.turn(r, c, this.isBlackTurn);
    } catch (e) {
      console.log(e);
      return;
    }

    this.isBlackTurn = !this.isBlackTurn;
    if (!this.board.checkHasValidMove(this.isBlackTurn)) {
      this.isBlackTurn = !this.isBlackTurn;
      if (!this.board.checkHasValidMove(this.isBlackTurn)) {
        this.show();
        this.finish();
        return;
      }
    }
    this.show();
    this.showTurn();
  };
}
