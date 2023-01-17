import { ScoreBoard } from "./score-board";

export class Player {
    name: string;
    currentPlayer: boolean;
    score: ScoreBoard;


    constructor(name: string, currentPlayer: boolean, score: ScoreBoard){
        this.name = name;
        this.currentPlayer = currentPlayer;
        this.score = score;
    }
}
