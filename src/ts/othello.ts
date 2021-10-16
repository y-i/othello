import Board, { Stone } from './board';
import Algorithm from './algorithm/algorithm';
import SimpleAlgo from './algorithm/simple';
import RandomAlgo from './algorithm/random';
import KaihoudoAlgo from './algorithm/kaihoudo';
import MonteCarloAlgo from './algorithm/montecarlo';
import Player from './algorithm/player';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class Othello {
  private board: Board;
  private isBlackTurn: boolean;
  private boardElem: HTMLElement;
  private turndElem: HTMLElement;
  private players: Algorithm[];

  constructor(boardElem: HTMLElement, turnElem: HTMLElement) {
    this.boardElem = boardElem;
    this.turndElem = turnElem;
    this.board = new Board();
    this.isBlackTurn = true;

    //this.players = [new KaihoudoAlgo(), new Player()];
    //this.players = [new MonteCarloAlgo(), new Player()];
    //his.players = [new MonteCarloAlgo(), new KaihoudoAlgo()];
    this.players = [new Player(), new MonteCarloAlgo()];
    //this.players = [new Player(), new KaihoudoAlgo()];
    //this.players = [new RandomAlgo(), new KaihoudoAlgo()];
    console.log(`${this.players[1].name} vs. ${this.players[0].name}`);
  }

  init(): void {
    this.show();
    this.showTurn();
    this.next();
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
                inner.dataset.row = i.toString();
                inner.dataset.col = j.toString();
                if (sq === Stone.Black) inner.dataset.stone = 'black';
                if (sq === Stone.White) inner.dataset.stone = 'white';
                if (sq === Stone.Empty) {
                  if (this.board.checkTurnCount(i, j, this.isBlackTurn) > 0) {
                    inner.dataset.stone = this.isBlackTurn ? 'black' : 'white';
                    inner.classList.add('candidate');
                  }
                }
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
    this.turndElem.innerText = `Finish! ${this.board.blackStone} - ${this.board.whiteStone}`;
  }

  private putEvent = async (e: MouseEvent) => {
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

    setTimeout(() => {
      this.next();
    }, 0);
  };

  private next = async () => {
    const turnNum = this.isBlackTurn ? 1 : 0;
    if (this.players[turnNum] instanceof Player) return;

    const now = Date.now();
    const [r, c] = await this.players[turnNum].think(
      this.board,
      this.isBlackTurn
    );
    await sleep(Math.max(0, 1000 - (Date.now() - now)));
    this.board.turn(r, c, this.isBlackTurn);

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

    setTimeout(() => {
      this.next();
    }, 0);
  };
}
