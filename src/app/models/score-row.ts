import { Die } from "./die";

export class ScoreRow {
    public name: string;
    public score: number;
    public selectable: boolean;
    public requirements?: Die[];

    constructor(name: string, score: number, selectable: boolean, requirements?: Die[]){
        this.name = name;
        this.score = score;
        this.selectable = selectable;
        this.requirements = requirements
    }
}
