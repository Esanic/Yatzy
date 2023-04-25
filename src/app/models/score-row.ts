export class ScoreRow {
    public id: number;
    public name: string;
    public score: number;
    public selectable: boolean;
    public bonusApplied?: boolean;

    constructor(id: number,name: string, score: number, selectable: boolean, bonusApplied?: boolean){
        this.id = id;
        this.name = name;
        this.score = score;
        this.selectable = selectable;
        this.bonusApplied = bonusApplied;
    }
}
