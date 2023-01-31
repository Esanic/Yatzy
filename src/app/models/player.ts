import { DiceService } from "../services/dice.service";
import { ScoreService } from "../services/score.service";
import { ScoreBoard } from "./score-board";

export class Player {
    name: string;
    socketId: string;
    currentPlayer: boolean;
    score: ScoreBoard;

    constructor(name: string, socketId: string, currentPlayer: boolean, score: ScoreBoard){
        this.name = name;
        this.socketId = socketId;
        this.currentPlayer = currentPlayer;
        this.score = score;
    }
}

