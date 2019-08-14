import Othello from "./othello";

const othello = new Othello(
  document.getElementById("board"),
  document.getElementById("turn")
);
othello.init();
