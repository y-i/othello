import Board from '../board';

export default abstract class Algorithm {
  abstract name: string;
  abstract async think(board: Board, isBlackTrun: boolean): Promise<number[]>;
}
