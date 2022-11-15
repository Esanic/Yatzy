export class ScoreRow {
    public name: string;
    public score: number;
    public selectable: boolean;
    public bonusApplied?: boolean;

    constructor(name: string, score: number, selectable: boolean, bonusApplied?: boolean){
        this.name = name;
        this.score = score;
        this.selectable = selectable;
        this.bonusApplied = bonusApplied;
    }
}
